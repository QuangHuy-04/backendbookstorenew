import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    BadRequestException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './schemas/book.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Get()
    async getBooks(
        @Query('category') category?: string,
        @Query('search') search?: string,
        @Query('sortBy') sortBy?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.booksService.findAll({
            category,
            search,
            sortBy,
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        });
    }

    @Get('featured')
    async getFeaturedBooks(@Query('limit') limit?: string) {
        const limitNum = limit ? parseInt(limit) : 8;
        return this.booksService.getFeatured(limitNum);
    }

    @Get('search')
    async searchBooks(@Query('q') query: string) {
        return this.booksService.search(query);
    }

    @Get(':id')
    async getBookById(@Param('id') id: string) {
        return this.booksService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async createBook(@Body() createBookDto: Partial<Book>) {
        try {
            return await this.booksService.create(createBookDto);
        } catch (error) {
            console.error('Error creating book:', error);
            if (error.code === 11000) {
                throw new BadRequestException('ISBN already exists');
            }
            if (error.name === 'ValidationError') {
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error.message || 'Error creating book');
        }
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async updateBook(
        @Param('id') id: string,
        @Body() updateBookDto: Partial<Book>,
    ) {
        return this.booksService.update(id, updateBookDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async deleteBook(@Param('id') id: string) {
        await this.booksService.remove(id);
        return { message: 'Book deleted successfully' };
    }
}
