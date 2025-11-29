import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { Book } from '../books/schemas/book.schema';
export declare class OrdersService {
    private orderModel;
    private bookModel;
    constructor(orderModel: Model<Order>, bookModel: Model<Book>);
    create(createOrderDto: any, userId: string): Promise<Order>;
    findAll(userId: string): Promise<Order[]>;
    findOne(id: string, userId: string): Promise<Order | null>;
    updateStatus(id: string, status: string): Promise<Order | null>;
    cancelOrder(id: string, userId: string, isAdmin?: boolean): Promise<Order | null>;
    updatePayment(id: string, transactionId: string): Promise<Order | null>;
    getAllOrders(): Promise<Order[]>;
    private incrementSoldCount;
    private decrementSoldCount;
}
