import { Model } from 'mongoose';
import { Category, CategoryDocument } from './categories.schema';
import { Book } from '../books/schemas/book.schema';
export declare class CategoriesService {
    private categoryModel;
    private bookModel;
    constructor(categoryModel: Model<CategoryDocument>, bookModel: Model<Book>);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<Category | null>;
    findBySlug(slug: string): Promise<Category | null>;
    create(category: Partial<Category>): Promise<Category>;
    update(id: string, category: Partial<Category>): Promise<Category | null>;
    delete(id: string): Promise<Category | null>;
}
