import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './categories.schema';
import { Book } from '../books/schemas/book.schema';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
        @InjectModel(Book.name) private bookModel: Model<Book>,
    ) { }

    async findAll(): Promise<any[]> {
        const categories = await this.categoryModel.find({ isActive: true }).exec();

        // Count books for each category
        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const bookCount = await this.bookModel.countDocuments({
                    category: category.name,
                    isActive: true
                }).exec();

                return {
                    ...category.toObject(),
                    bookCount
                };
            })
        );

        return categoriesWithCount;
    }

    async findOne(id: string): Promise<Category | null> {
        return this.categoryModel.findById(id).exec();
    }

    async findBySlug(slug: string): Promise<Category | null> {
        return this.categoryModel.findOne({ slug, isActive: true }).exec();
    }

    async create(category: Partial<Category>): Promise<Category> {
        const newCategory = new this.categoryModel(category);
        return newCategory.save();
    }

    async update(id: string, category: Partial<Category>): Promise<Category | null> {
        return this.categoryModel.findByIdAndUpdate(id, category, { new: true }).exec();
    }

    async delete(id: string): Promise<Category | null> {
        return this.categoryModel.findByIdAndDelete(id).exec();
    }
}
