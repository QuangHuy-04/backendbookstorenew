import { Model } from 'mongoose';
import { Review } from './schemas/review.schema';
import { Order } from '../orders/schemas/order.schema';
import { Book } from '../books/schemas/book.schema';
export declare class ReviewsService {
    private reviewModel;
    private orderModel;
    private bookModel;
    constructor(reviewModel: Model<Review>, orderModel: Model<Order>, bookModel: Model<Book>);
    create(userId: string, bookId: string, rating: number, comment: string): Promise<Review>;
    findByBook(bookId: string): Promise<Review[]>;
    findByUser(userId: string): Promise<Review[]>;
    delete(reviewId: string, userId: string): Promise<void>;
    private hasUserPurchasedBook;
    private updateBookRating;
}
