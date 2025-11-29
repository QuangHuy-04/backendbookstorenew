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
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const book_schema_1 = require("./schemas/book.schema");
let BooksService = class BooksService {
    bookModel;
    constructor(bookModel) {
        this.bookModel = bookModel;
    }
    async onModuleInit() {
        try {
            await this.bookModel.collection.dropIndexes();
        }
        catch (error) {
            console.log('Error dropping indexes (might not exist):', error.message);
        }
    }
    async findAll(params) {
        const { category, search, sortBy = '-createdAt', page = 1, limit = 12, } = params || {};
        const query = { isActive: true };
        if (category) {
            query.category = category;
        }
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
    async findOne(id) {
        const book = await this.bookModel.findById(id).exec();
        if (!book) {
            throw new common_1.NotFoundException(`Book with id ${id} not found`);
        }
        return book;
    }
    async search(query) {
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
    async create(createBookDto) {
        const book = new this.bookModel(createBookDto);
        return book.save();
    }
    async update(id, updateBookDto) {
        const book = await this.bookModel
            .findByIdAndUpdate(id, updateBookDto, { new: true })
            .exec();
        if (!book) {
            throw new common_1.NotFoundException(`Book with id ${id} not found`);
        }
        return book;
    }
    async remove(id) {
        const result = await this.bookModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Book with id ${id} not found`);
        }
    }
    async getFeatured(limit = 8) {
        return this.bookModel
            .find({ isActive: true })
            .sort('-rating -reviewCount')
            .limit(limit)
            .exec();
    }
    async getByCategory(category, limit = 12) {
        return this.bookModel
            .find({ category, isActive: true })
            .limit(limit)
            .exec();
    }
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(book_schema_1.Book.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BooksService);
//# sourceMappingURL=books.service.js.map