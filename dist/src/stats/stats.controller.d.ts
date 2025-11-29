import { Model } from 'mongoose';
import { Book } from '../books/schemas/book.schema';
import { Order } from '../orders/schemas/order.schema';
export declare class StatsController {
    private bookModel;
    private orderModel;
    constructor(bookModel: Model<Book>, orderModel: Model<Order>);
    getDashboardStats(): Promise<{
        totalBooks: number;
        totalOrders: number;
        totalRevenue: any;
        recentOrders: (import("mongoose").Document<unknown, {}, Order, {}, {}> & Order & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        ordersByStatus: any[];
    }>;
}
