import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createReview(
        @Request() req,
        @Body() body: { bookId: string; rating: number; comment: string },
    ) {
        return this.reviewsService.create(
            req.user.userId,
            body.bookId,
            body.rating,
            body.comment,
        );
    }

    @Get('book/:bookId')
    async getBookReviews(@Param('bookId') bookId: string) {
        return this.reviewsService.findByBook(bookId);
    }

    @Get('my-reviews')
    @UseGuards(JwtAuthGuard)
    async getMyReviews(@Request() req) {
        return this.reviewsService.findByUser(req.user.userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteReview(@Param('id') id: string, @Request() req) {
        await this.reviewsService.delete(id, req.user.userId);
        return { message: 'Review deleted successfully' };
    }
}
