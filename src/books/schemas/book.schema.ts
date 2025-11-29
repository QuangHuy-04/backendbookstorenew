import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Book extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    author: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    category: string;

    @Prop({ required: true, unique: true })
    isbn: string;

    @Prop({ required: true })
    pages: number;

    @Prop({ default: 'English' })
    language: string;

    @Prop()
    publisher: string;

    @Prop()
    publishDate: string;

    @Prop({ default: true })
    inStock: boolean;

    @Prop({ default: 0 })
    stock: number;

    @Prop({ default: 0 })
    rating: number;

    @Prop({ default: 0 })
    reviewCount: number;

    @Prop({ default: 0 })
    soldCount: number;

    @Prop({ type: [String], default: [] })
    images: string[];

    @Prop({ default: true })
    isActive: boolean;

    @Prop()
    slug: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);

// Create indexes for better search performance
BookSchema.index({ title: 'text', author: 'text', description: 'text' }, { language_override: 'text_search_language', default_language: 'none' });
BookSchema.index({ category: 1 });
BookSchema.index({ slug: 1 });
