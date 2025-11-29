import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PromoCodeDocument = PromoCode & Document;

@Schema({ timestamps: true })
export class PromoCode {
    @Prop({ required: true, unique: true, uppercase: true, trim: true })
    code: string;

    @Prop({ required: true, enum: ['percentage', 'fixed'] })
    type: string;

    @Prop({ required: true })
    value: number; // Percentage (0-100) or Fixed Amount

    @Prop({ required: true })
    minOrderValue: number;

    @Prop()
    maxDiscount?: number; // For percentage codes

    @Prop({ required: true })
    startDate: Date;

    @Prop({ required: true })
    endDate: Date;

    @Prop({ default: 0 })
    usageLimit: number; // 0 for unlimited

    @Prop({ default: 0 })
    usedCount: number;

    @Prop({ default: true })
    isActive: boolean;
}

export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode);
