import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Book } from './schemas/book.schema';
export declare class BooksService implements OnModuleInit {
    private bookModel;
    constructor(bookModel: Model<Book>);
    onModuleInit(): Promise<void>;
    findAll(params?: {
        category?: string;
        search?: string;
        sortBy?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        books: (import("mongoose").Document<unknown, {}, Book, {}, {}> & Book & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Book>;
    search(query: string): Promise<(import("mongoose").Document<unknown, {}, Book, {}, {}> & Book & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    create(createBookDto: Partial<Book>): Promise<Book>;
    update(id: string, updateBookDto: Partial<Book>): Promise<Book>;
    remove(id: string): Promise<void>;
    getFeatured(limit?: number): Promise<Book[]>;
    getByCategory(category: string, limit?: number): Promise<Book[]>;
}
