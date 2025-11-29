import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Address extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    zipCode: string;

    @Prop({ default: false })
    isDefault: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
