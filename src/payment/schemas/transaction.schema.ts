import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
    order: Types.ObjectId;

    @Prop({ enum: ['vnpay', 'momo'], required: true })
    provider: string;

    @Prop({ required: true, unique: true })
    transactionId: string;

    @Prop({ required: true })
    amount: number;

    @Prop({
        enum: ['pending', 'success', 'failed', 'cancelled'],
        default: 'pending',
    })
    status: string;

    @Prop({ type: Object })
    rawResponse: any;

    @Prop()
    errorMessage: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
