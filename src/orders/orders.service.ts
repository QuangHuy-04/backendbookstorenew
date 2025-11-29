import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './schemas/order.schema';
import { Book } from '../books/schemas/book.schema';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<Order>,
        @InjectModel(Book.name) private bookModel: Model<Book>,
    ) { }

    async create(createOrderDto: any, userId: string): Promise<Order> {
        const newOrder = new this.orderModel({
            ...createOrderDto,
            user: new Types.ObjectId(userId),
        });
        return newOrder.save();
    }

    async findAll(userId: string): Promise<Order[]> {
        return this.orderModel
            .find({ user: new Types.ObjectId(userId) })
            .populate('items.book')
            .sort({ createdAt: -1 })
            .exec();
    }

    async findOne(id: string, userId: string): Promise<Order | null> {
        const order = await this.orderModel
            .findOne({ _id: new Types.ObjectId(id), user: new Types.ObjectId(userId) })
            .populate('items.book')
            .exec();

        if (!order) {
            throw new NotFoundException(`Order #${id} not found`);
        }

        return order;
    }

    async updateStatus(id: string, status: string): Promise<Order | null> {
        const order = await this.orderModel.findById(id).exec();

        if (!order) {
            throw new NotFoundException(`Order #${id} not found`);
        }

        const previousStatus = order.status;

        // Update order status
        const updatedOrder = await this.orderModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();

        // If order is marked as delivered, increment soldCount for each book
        if (status === 'delivered' && previousStatus !== 'delivered') {
            await this.incrementSoldCount(order);
        }

        // If previously delivered order is cancelled, decrement soldCount
        if (status === 'cancelled' && previousStatus === 'delivered') {
            await this.decrementSoldCount(order);
        }

        return updatedOrder;
    }

    async cancelOrder(id: string, userId: string, isAdmin: boolean = false): Promise<Order | null> {
        const order = await this.orderModel.findById(id).exec();

        if (!order) {
            throw new NotFoundException(`Order #${id} not found`);
        }

        // Check ownership if not admin
        if (!isAdmin && order.user.toString() !== userId) {
            throw new BadRequestException('You can only cancel your own orders');
        }

        // Can only cancel pending orders
        if (order.status !== 'pending') {
            throw new BadRequestException('Only pending orders can be cancelled');
        }

        return this.updateStatus(id, 'cancelled');
    }

    async updatePayment(id: string, transactionId: string): Promise<Order | null> {
        return this.orderModel
            .findByIdAndUpdate(
                id,
                { status: 'paid', transactionId, paidAt: new Date() },
                { new: true }
            )
            .exec();
    }

    async getAllOrders(): Promise<Order[]> {
        return this.orderModel
            .find()
            .populate('user', 'email name')
            .populate('items.book')
            .sort({ createdAt: -1 })
            .exec();
    }

    private async incrementSoldCount(order: Order): Promise<void> {
        for (const item of order.items) {
            await this.bookModel.findByIdAndUpdate(
                item.book,
                { $inc: { soldCount: item.quantity } }
            );
        }
    }

    private async decrementSoldCount(order: Order): Promise<void> {
        for (const item of order.items) {
            await this.bookModel.findByIdAndUpdate(
                item.book,
                { $inc: { soldCount: -item.quantity } }
            );
        }
    }
}
