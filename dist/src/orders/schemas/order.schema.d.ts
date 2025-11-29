import { Document, Types } from 'mongoose';
declare class ShippingAddress {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
}
declare class OrderItem {
    book: Types.ObjectId;
    quantity: number;
    price: number;
    title: string;
}
export declare class Order extends Document {
    user: Types.ObjectId;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    discount: number;
    promoCode: string;
    status: string;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    transactionId: string;
    paidAt: Date;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order, any, {}> & Order & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Order> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
export {};
