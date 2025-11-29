import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './categories.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    async findAll(): Promise<Category[]> {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Category> {
        const category = await this.categoriesService.findOne(id);
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }

    @Get('slug/:slug')
    async findBySlug(@Param('slug') slug: string): Promise<Category> {
        const category = await this.categoriesService.findBySlug(slug);
        if (!category) {
            throw new NotFoundException(`Category with slug ${slug} not found`);
        }
        return category;
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async create(@Body() category: Partial<Category>): Promise<Category> {
        return this.categoriesService.create(category);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async update(
        @Param('id') id: string,
        @Body() category: Partial<Category>,
    ): Promise<Category> {
        const updatedCategory = await this.categoriesService.update(id, category);
        if (!updatedCategory) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return updatedCategory;
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async delete(@Param('id') id: string): Promise<Category> {
        const deletedCategory = await this.categoriesService.delete(id);
        if (!deletedCategory) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return deletedCategory;
    }
}
