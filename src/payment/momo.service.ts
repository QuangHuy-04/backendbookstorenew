import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { Transaction } from './schemas/transaction.schema';
import { Order } from '../orders/schemas/order.schema';

@Injectable()
export class MomoService {
    private readonly partnerCode: string;
    private readonly accessKey: string;
    private readonly secretKey: string;
    private readonly endpoint = 'https://test-payment.momo.vn/v2/gateway/api/create';

    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
        @InjectModel(Order.name) private orderModel: Model<Order>,
    ) {
        // Use environment variables or default values for development
        this.partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMO_PARTNER_CODE';
        this.accessKey = process.env.MOMO_ACCESS_KEY || 'MOMO_ACCESS_KEY';
        this.secretKey = process.env.MOMO_SECRET_KEY || 'MOMO_SECRET_KEY';

        if (!process.env.MOMO_PARTNER_CODE) {
            console.warn('⚠️  MOMO_PARTNER_CODE not set - using default value. Payment will not work in production.');
        }
    }

    async createPayment(
        orderId: string,
        amount: number,
        returnUrl: string,
        ipnUrl: string,
    ): Promise<any> {
        const requestId = `${orderId}_${Date.now()}`;
        const orderInfo = `BookStore Order ${orderId}`;
        const requestType = 'captureWallet';

        const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${requestId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=${requestType}`;

        const signature = crypto
            .createHmac('sha256', this.secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = {
            partnerCode: this.partnerCode,
            partnerName: 'BookStore',
            storeId: 'BookStore',
            requestId,
            amount,
            orderId: requestId,
            orderInfo,
            redirectUrl: returnUrl,
            ipnUrl,
            lang: 'vi',
            requestType,
            autoCapture: true,
            extraData: '',
            signature,
        };

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            // Create pending transaction
            const transaction = new this.transactionModel({
                order: orderId,
                provider: 'momo',
                transactionId: requestId,
                amount,
                status: 'pending',
                rawResponse: data,
            });

            await transaction.save();

            return data;
        } catch (error) {
            console.error('Momo payment error:', error);
            throw error;
        }
    }

    async handleCallback(body: any): Promise<{ resultCode: number; message: string }> {
        try {
            // Verify signature
            const rawSignature = `accessKey=${this.accessKey}&amount=${body.amount}&extraData=${body.extraData}&message=${body.message}&orderId=${body.orderId}&orderInfo=${body.orderInfo}&orderType=${body.orderType}&partnerCode=${body.partnerCode}&payType=${body.payType}&requestId=${body.requestId}&responseTime=${body.responseTime}&resultCode=${body.resultCode}&transId=${body.transId}`;

            const signature = crypto
                .createHmac('sha256', this.secretKey)
                .update(rawSignature)
                .digest('hex');

            if (signature !== body.signature) {
                return { resultCode: 97, message: 'Invalid signature' };
            }

            const orderId = body.orderId.split('_')[0];

            // Update transaction
            await this.transactionModel.findOneAndUpdate(
                { transactionId: body.requestId },
                {
                    status: body.resultCode === 0 ? 'success' : 'failed',
                    rawResponse: body,
                    errorMessage: body.resultCode !== 0 ? body.message : undefined,
                },
            );

            // Update order if payment successful
            if (body.resultCode === 0) {
                await this.orderModel.findByIdAndUpdate(orderId, {
                    status: 'paid',
                    transactionId: body.transId,
                    paidAt: new Date(),
                });

                return { resultCode: 0, message: 'Success' };
            }

            return { resultCode: body.resultCode, message: body.message };
        } catch (error) {
            console.error('Momo callback error:', error);
            return { resultCode: 99, message: 'Unknown error' };
        }
    }

    validateSignature(data: any, signature: string): boolean {
        const rawSignature = Object.keys(data)
            .sort()
            .map((key) => `${key}=${data[key]}`)
            .join('&');

        const expectedSignature = crypto
            .createHmac('sha256', this.secretKey)
            .update(rawSignature)
            .digest('hex');

        return signature === expectedSignature;
    }
}
