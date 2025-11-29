import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(req: any, body: {
        bookId: string;
        rating: number;
        comment: string;
    }): Promise<import("./schemas/review.schema").Review>;
    getBookReviews(bookId: string): Promise<import("./schemas/review.schema").Review[]>;
    getMyReviews(req: any): Promise<import("./schemas/review.schema").Review[]>;
    deleteReview(id: string, req: any): Promise<{
        message: string;
    }>;
}
