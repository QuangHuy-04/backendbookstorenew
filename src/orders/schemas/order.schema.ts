import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class ShippingAddress {
    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    zipCode: string;
}

class OrderItem {
    @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
    book: Types.ObjectId;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    title: string;
}

@Schema({ timestamps: true })
export class Order extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ type: [OrderItem], required: true })
    items: OrderItem[];

    @Prop({ required: true })
    subtotal: number;

    @Prop({ required: true })
    shipping: number;

    @Prop({ required: true })
    tax: number;

    @Prop({ required: true })
    total: number;

    @Prop({ default: 0 })
    discount: number;

    @Prop()
    promoCode: string;

    @Prop({
        required: true,
        enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    })
    status: string;

    @Prop({ type: ShippingAddress, required: true })
    shippingAddress: ShippingAddress;

    @Prop({ enum: ['vnpay', 'momo', 'cod'], required: true })
    paymentMethod: string;

    @Prop()
    transactionId: string;

    @Prop()
    paidAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
