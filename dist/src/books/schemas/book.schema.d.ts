import { Document } from 'mongoose';
export declare class Book extends Document {
    title: string;
    author: string;
    description: string;
    price: number;
    category: string;
    isbn: string;
    pages: number;
    language: string;
    publisher: string;
    publishDate: string;
    inStock: boolean;
    stock: number;
    rating: number;
    reviewCount: number;
    soldCount: number;
    images: string[];
    isActive: boolean;
    slug: string;
}
export declare const BookSchema: import("mongoose").Schema<Book, import("mongoose").Model<Book, any, any, any, Document<unknown, any, Book, any, {}> & Book & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Book, Document<unknown, {}, import("mongoose").FlatRecord<Book>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Book> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
