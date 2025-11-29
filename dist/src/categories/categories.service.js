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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const categories_schema_1 = require("./categories.schema");
const book_schema_1 = require("../books/schemas/book.schema");
let CategoriesService = class CategoriesService {
    categoryModel;
    bookModel;
    constructor(categoryModel, bookModel) {
        this.categoryModel = categoryModel;
        this.bookModel = bookModel;
    }
    async findAll() {
        const categories = await this.categoryModel.find({ isActive: true }).exec();
        const categoriesWithCount = await Promise.all(categories.map(async (category) => {
            const bookCount = await this.bookModel.countDocuments({
                category: category.name,
                isActive: true
            }).exec();
            return {
                ...category.toObject(),
                bookCount
            };
        }));
        return categoriesWithCount;
    }
    async findOne(id) {
        return this.categoryModel.findById(id).exec();
    }
    async findBySlug(slug) {
        return this.categoryModel.findOne({ slug, isActive: true }).exec();
    }
    async create(category) {
        const newCategory = new this.categoryModel(category);
        return newCategory.save();
    }
    async update(id, category) {
        return this.categoryModel.findByIdAndUpdate(id, category, { new: true }).exec();
    }
    async delete(id) {
        return this.categoryModel.findByIdAndDelete(id).exec();
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(categories_schema_1.Category.name)),
    __param(1, (0, mongoose_1.InjectModel)(book_schema_1.Book.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map