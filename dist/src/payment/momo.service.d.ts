import { Model } from 'mongoose';
import { Transaction } from './schemas/transaction.schema';
import { Order } from '../orders/schemas/order.schema';
export declare class MomoService {
    private transactionModel;
    private orderModel;
    private readonly partnerCode;
    private readonly accessKey;
    private readonly secretKey;
    private readonly endpoint;
    constructor(transactionModel: Model<Transaction>, orderModel: Model<Order>);
    createPayment(orderId: string, amount: number, returnUrl: string, ipnUrl: string): Promise<any>;
    handleCallback(body: any): Promise<{
        resultCode: number;
        message: string;
    }>;
    validateSignature(data: any, signature: string): boolean;
}
