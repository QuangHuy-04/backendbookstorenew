import { Model } from 'mongoose';
import { Transaction } from './schemas/transaction.schema';
import { Order } from '../orders/schemas/order.schema';
export declare class VNPayService {
    private transactionModel;
    private orderModel;
    private readonly tmnCode;
    private readonly secretKey;
    private readonly vnpUrl;
    constructor(transactionModel: Model<Transaction>, orderModel: Model<Order>);
    createPaymentUrl(orderId: string, amount: number, returnUrl: string): string;
    verifyReturnUrl(params: Record<string, string>): Promise<boolean>;
    handleIPN(params: Record<string, string>): Promise<{
        RspCode: string;
        Message: string;
    }>;
    private sortObject;
    private formatDate;
}
