import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { Transaction } from './schemas/transaction.schema';
import { Order } from '../orders/schemas/order.schema';

@Injectable()
export class VNPayService {
    private readonly tmnCode = process.env.VNPAY_TMN_CODE || '';
    private readonly secretKey = process.env.VNPAY_SECRET_KEY || '';
    private readonly vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
        @InjectModel(Order.name) private orderModel: Model<Order>,
    ) { }

    createPaymentUrl(orderId: string, amount: number, returnUrl: string): string {
        const createDate = this.formatDate(new Date());
        const orderId_vnp = `${orderId}_${Date.now()}`;

        const vnpParams: Record<string, string> = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: this.tmnCode,
            vnp_Amount: (amount * 100).toString(), // VNPay requires amount in VND * 100
            vnp_CreateDate: createDate,
            vnp_CurrCode: 'VND',
            vnp_IpAddr: '127.0.0.1',
            vnp_Locale: 'vn',
            vnp_OrderInfo: `BookStore Order ${orderId}`,
            vnp_OrderType: 'other',
            vnp_ReturnUrl: returnUrl,
            vnp_TxnRef: orderId_vnp,
        };

        // Sort params and create query string
        const sortedParams = this.sortObject(vnpParams);
        const signData = new URLSearchParams(sortedParams).toString();
        const hmac = crypto.createHmac('sha512', this.secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        sortedParams['vnp_SecureHash'] = signed;
        const finalUrl = `${this.vnpUrl}?${new URLSearchParams(sortedParams).toString()}`;

        return finalUrl;
    }

    async verifyReturnUrl(params: Record<string, string>): Promise<boolean> {
        const secureHash = params['vnp_SecureHash'];
        delete params['vnp_SecureHash'];
        delete params['vnp_SecureHashType'];

        const sortedParams = this.sortObject(params);
        const signData = new URLSearchParams(sortedParams).toString();
        const hmac = crypto.createHmac('sha512', this.secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        return secureHash === signed;
    }

    async handleIPN(params: Record<string, string>): Promise<{ RspCode: string; Message: string }> {
        try {
            const isValid = await this.verifyReturnUrl(params);

            if (!isValid) {
                return { RspCode: '97', Message: 'Invalid signature' };
            }

            const orderId = params['vnp_TxnRef'].split('_')[0];
            const amount = parseFloat(params['vnp_Amount']) / 100;
            const responseCode = params['vnp_ResponseCode'];

            // Create transaction record
            const transaction = new this.transactionModel({
                order: orderId,
                provider: 'vnpay',
                transactionId: params['vnp_TransactionNo'] || params['vnp_TxnRef'],
                amount,
                status: responseCode === '00' ? 'success' : 'failed',
                rawResponse: params,
            });

            await transaction.save();

            // Update order if payment successful
            if (responseCode === '00') {
                await this.orderModel.findByIdAndUpdate(orderId, {
                    status: 'paid',
                    transactionId: params['vnp_TransactionNo'] || params['vnp_TxnRef'],
                    paidAt: new Date(),
                });

                return { RspCode: '00', Message: 'Success' };
            }

            return { RspCode: responseCode, Message: 'Payment failed' };
        } catch (error) {
            console.error('VNPay IPN error:', error);
            return { RspCode: '99', Message: 'Unknown error' };
        }
    }

    private sortObject(obj: Record<string, string>): Record<string, string> {
        const sorted: Record<string, string> = {};
        const keys = Object.keys(obj).sort();

        keys.forEach((key) => {
            sorted[key] = obj[key];
        });

        return sorted;
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }
}
