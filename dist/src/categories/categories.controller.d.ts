import { CategoriesService } from './categories.service';
import { Category } from './categories.schema';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    findBySlug(slug: string): Promise<Category>;
    create(category: Partial<Category>): Promise<Category>;
    update(id: string, category: Partial<Category>): Promise<Category>;
    delete(id: string): Promise<Category>;
}
