import { BooksService } from './books.service';
import { Book } from './schemas/book.schema';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    getBooks(category?: string, search?: string, sortBy?: string, page?: string, limit?: string): Promise<{
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
    getFeaturedBooks(limit?: string): Promise<Book[]>;
    searchBooks(query: string): Promise<(import("mongoose").Document<unknown, {}, Book, {}, {}> & Book & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getBookById(id: string): Promise<Book>;
    createBook(createBookDto: Partial<Book>): Promise<Book>;
    updateBook(id: string, updateBookDto: Partial<Book>): Promise<Book>;
    deleteBook(id: string): Promise<{
        message: string;
    }>;
}
