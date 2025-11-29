import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from '../books/schemas/book.schema';
import { Order } from '../orders/schemas/order.schema';

@Controller('stats')
export class StatsController {
    constructor(
        @InjectModel(Book.name) private bookModel: Model<Book>,
        @InjectModel(Order.name) private orderModel: Model<Order>,
    ) { }

    @Get('dashboard')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async getDashboardStats() {
        // Get total books count
        const totalBooks = await this.bookModel.countDocuments();

        // Get total orders count
        const totalOrders = await this.orderModel.countDocuments();

        // Calculate total revenue
        const revenueResult = await this.orderModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$total' }
                }
            }
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        // Get recent orders (last 10)
        const recentOrders = await this.orderModel
            .find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name email')
            .populate('items.book', 'title')
            .exec();

        // Get orders by status
        const ordersByStatus = await this.orderModel.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        return {
            totalBooks,
            totalOrders,
            totalRevenue,
            recentOrders,
            ordersByStatus,
        };
    }
}
