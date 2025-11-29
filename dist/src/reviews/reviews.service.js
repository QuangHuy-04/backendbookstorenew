"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_schema_1 = require("./schemas/review.schema");
const order_schema_1 = require("../orders/schemas/order.schema");
const book_schema_1 = require("../books/schemas/book.schema");
let ReviewsService = class ReviewsService {
    reviewModel;
    orderModel;
    bookModel;
    constructor(reviewModel, orderModel, bookModel) {
        this.reviewModel = reviewModel;
        this.orderModel = orderModel;
        this.bookModel = bookModel;
    }
    async create(userId, bookId, rating, comment) {
        const hasPurchased = await this.hasUserPurchasedBook(userId, bookId);
        if (!hasPurchased) {
            throw new common_1.BadRequestException('Bạn chỉ có thể đánh giá sách mà bạn đã mua');
        }
        const existingReviews = await this.reviewModel.countDocuments({
            user: new mongoose_2.Types.ObjectId(userId),
            book: new mongoose_2.Types.ObjectId(bookId),
        });
        if (existingReviews >= 2) {
            throw new common_1.BadRequestException('Bạn chỉ có thể thêm tối đa 2 đánh giá cho mỗi cuốn sách');
        }
        const review = new this.reviewModel({
            user: new mongoose_2.Types.ObjectId(userId),
            book: new mongoose_2.Types.ObjectId(bookId),
            rating,
            comment,
        });
        await review.save();
        await this.updateBookRating(bookId);
        return review;
    }
    async findByBook(bookId) {
        return this.reviewModel
            .find({ book: new mongoose_2.Types.ObjectId(bookId) })
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findByUser(userId) {
        return this.reviewModel
            .find({ user: new mongoose_2.Types.ObjectId(userId) })
            .populate('book', 'title author images')
            .sort({ createdAt: -1 })
            .exec();
    }
    async delete(reviewId, userId) {
        const review = await this.reviewModel.findOne({
            _id: new mongoose_2.Types.ObjectId(reviewId),
            user: new mongoose_2.Types.ObjectId(userId),
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        const bookId = review.book.toString();
        await this.reviewModel.findByIdAndDelete(reviewId);
        await this.updateBookRating(bookId);
    }
    async hasUserPurchasedBook(userId, bookId) {
        const order = await this.orderModel.findOne({
            user: new mongoose_2.Types.ObjectId(userId),
            'items.book': new mongoose_2.Types.ObjectId(bookId),
            status: { $in: ['delivered'] },
        });
        return !!order;
    }
    async updateBookRating(bookId) {
        const reviews = await this.reviewModel.find({ book: new mongoose_2.Types.ObjectId(bookId) });
        const reviewCount = reviews.length;
        const averageRating = reviewCount > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
            : 0;
        await this.bookModel.findByIdAndUpdate(bookId, {
            rating: Math.round(averageRating * 10) / 10,
            reviewCount,
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(2, (0, mongoose_1.InjectModel)(book_schema_1.Book.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map