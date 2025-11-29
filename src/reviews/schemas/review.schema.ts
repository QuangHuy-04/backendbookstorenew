import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Review extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
    book: Types.ObjectId;

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop({ required: true })
    comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Create compound index to enforce one review per user per book
// Note: User can delete and add again, so we don't use unique index
ReviewSchema.index({ user: 1, book: 1 });
