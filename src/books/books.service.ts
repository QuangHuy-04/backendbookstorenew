import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './schemas/book.schema';

@Injectable()
export class BooksService implements OnModuleInit {
    // MongoDB-backed book service
    constructor(
        @InjectModel(Book.name) private bookModel: Model<Book>,
    ) { }

    async onModuleInit() {
        try {
            // Drop indexes to ensure they are recreated with correct settings
            // This fixes the "language override unsupported" error if schema changed
            await this.bookModel.collection.dropIndexes();
        } catch (error) {
            // Ignore error if indexes don't exist
            console.log('Error dropping indexes (might not exist):', error.message);
        }
    }

    async findAll(params?: {
        category?: string;
        search?: string;
        sortBy?: string;
        page?: number;
        limit?: number;
    }) {
        const {
            category,
            search,
            sortBy = '-createdAt',
            page = 1,
            limit = 12,
        } = params || {};

        const query: any = { isActive: true };

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Search by title, author, or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (page - 1) * limit;

        const [books, total] = await Promise.all([
            this.bookModel
                .find(query)
                .sort(sortBy)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.bookModel.countDocuments(query),
        ]);

        return {
            books,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<Book> {
        const book = await this.bookModel.findById(id).exec();
        if (!book) {
            throw new NotFoundException(`Book with id ${id} not found`);
        }
        return book;
    }

    async search(query: string) {
        const books = await this.bookModel
            .find({
                isActive: true,
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { author: { $regex: query, $options: 'i' } },
                    { isbn: { $regex: query, $options: 'i' } },
                ],
            })
            .limit(20)
            .exec();

        return books;
    }

    async create(createBookDto: Partial<Book>): Promise<Book> {
        const book = new this.bookModel(createBookDto);
        return book.save();
    }

    async update(id: string, updateBookDto: Partial<Book>): Promise<Book> {
        const book = await this.bookModel
            .findByIdAndUpdate(id, updateBookDto, { new: true })
            .exec();

        if (!book) {
            throw new NotFoundException(`Book with id ${id} not found`);
        }

        return book;
    }

    async remove(id: string): Promise<void> {
        const result = await this.bookModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Book with id ${id} not found`);
        }
    }

    async getFeatured(limit: number = 8): Promise<Book[]> {
        return this.bookModel
            .find({ isActive: true })
            .sort('-rating -reviewCount')
            .limit(limit)
            .exec();
    }

    async getByCategory(category: string, limit: number = 12): Promise<Book[]> {
        return this.bookModel
            .find({ category, isActive: true })
            .limit(limit)
            .exec();
    }
}
