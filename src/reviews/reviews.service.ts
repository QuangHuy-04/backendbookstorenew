import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review } from './schemas/review.schema';
import { Order } from '../orders/schemas/order.schema';
import { Book } from '../books/schemas/book.schema';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectModel(Review.name) private reviewModel: Model<Review>,
        @InjectModel(Order.name) private orderModel: Model<Order>,
        @InjectModel(Book.name) private bookModel: Model<Book>,
    ) { }

    async create(userId: string, bookId: string, rating: number, comment: string): Promise<Review> {
        // Check if user has purchased this book
        const hasPurchased = await this.hasUserPurchasedBook(userId, bookId);
        if (!hasPurchased) {
            throw new BadRequestException('Bạn chỉ có thể đánh giá sách mà bạn đã mua');
        }

        // Check how many reviews user has for this book (max 2)
        const existingReviews = await this.reviewModel.countDocuments({
            user: new Types.ObjectId(userId),
            book: new Types.ObjectId(bookId),
        });

        if (existingReviews >= 2) {
            throw new BadRequestException('Bạn chỉ có thể thêm tối đa 2 đánh giá cho mỗi cuốn sách');
        }

        // Create review
        const review = new this.reviewModel({
            user: new Types.ObjectId(userId),
            book: new Types.ObjectId(bookId),
            rating,
            comment,
        });

        await review.save();

        // Update book rating and review count
        await this.updateBookRating(bookId);

        return review;
    }

    async findByBook(bookId: string): Promise<Review[]> {
        return this.reviewModel
            .find({ book: new Types.ObjectId(bookId) })
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .exec();
    }

    async findByUser(userId: string): Promise<Review[]> {
        return this.reviewModel
            .find({ user: new Types.ObjectId(userId) })
            .populate('book', 'title author images')
            .sort({ createdAt: -1 })
            .exec();
    }

    async delete(reviewId: string, userId: string): Promise<void> {
        const review = await this.reviewModel.findOne({
            _id: new Types.ObjectId(reviewId),
            user: new Types.ObjectId(userId),
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        const bookId = review.book.toString();
        await this.reviewModel.findByIdAndDelete(reviewId);

        // Update book rating after deletion
        await this.updateBookRating(bookId);
    }

    private async hasUserPurchasedBook(userId: string, bookId: string): Promise<boolean> {
        const order = await this.orderModel.findOne({
            user: new Types.ObjectId(userId),
            'items.book': new Types.ObjectId(bookId),
            status: { $in: ['delivered'] }, // Only delivered orders count
        });

        return !!order;
    }

    private async updateBookRating(bookId: string): Promise<void> {
        const reviews = await this.reviewModel.find({ book: new Types.ObjectId(bookId) });

        const reviewCount = reviews.length;
        const averageRating = reviewCount > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
            : 0;

        await this.bookModel.findByIdAndUpdate(bookId, {
            rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            reviewCount,
        });
    }
}
