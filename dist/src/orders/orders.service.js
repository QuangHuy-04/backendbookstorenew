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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const book_schema_1 = require("../books/schemas/book.schema");
let OrdersService = class OrdersService {
    orderModel;
    bookModel;
    constructor(orderModel, bookModel) {
        this.orderModel = orderModel;
        this.bookModel = bookModel;
    }
    async create(createOrderDto, userId) {
        const newOrder = new this.orderModel({
            ...createOrderDto,
            user: new mongoose_2.Types.ObjectId(userId),
        });
        return newOrder.save();
    }
    async findAll(userId) {
        return this.orderModel
            .find({ user: new mongoose_2.Types.ObjectId(userId) })
            .populate('items.book')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id, userId) {
        const order = await this.orderModel
            .findOne({ _id: new mongoose_2.Types.ObjectId(id), user: new mongoose_2.Types.ObjectId(userId) })
            .populate('items.book')
            .exec();
        if (!order) {
            throw new common_1.NotFoundException(`Order #${id} not found`);
        }
        return order;
    }
    async updateStatus(id, status) {
        const order = await this.orderModel.findById(id).exec();
        if (!order) {
            throw new common_1.NotFoundException(`Order #${id} not found`);
        }
        const previousStatus = order.status;
        const updatedOrder = await this.orderModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();
        if (status === 'delivered' && previousStatus !== 'delivered') {
            await this.incrementSoldCount(order);
        }
        if (status === 'cancelled' && previousStatus === 'delivered') {
            await this.decrementSoldCount(order);
        }
        return updatedOrder;
    }
    async cancelOrder(id, userId, isAdmin = false) {
        const order = await this.orderModel.findById(id).exec();
        if (!order) {
            throw new common_1.NotFoundException(`Order #${id} not found`);
        }
        if (!isAdmin && order.user.toString() !== userId) {
            throw new common_1.BadRequestException('You can only cancel your own orders');
        }
        if (order.status !== 'pending') {
            throw new common_1.BadRequestException('Only pending orders can be cancelled');
        }
        return this.updateStatus(id, 'cancelled');
    }
    async updatePayment(id, transactionId) {
        return this.orderModel
            .findByIdAndUpdate(id, { status: 'paid', transactionId, paidAt: new Date() }, { new: true })
            .exec();
    }
    async getAllOrders() {
        return this.orderModel
            .find()
            .populate('user', 'email name')
            .populate('items.book')
            .sort({ createdAt: -1 })
            .exec();
    }
    async incrementSoldCount(order) {
        for (const item of order.items) {
            await this.bookModel.findByIdAndUpdate(item.book, { $inc: { soldCount: item.quantity } });
        }
    }
    async decrementSoldCount(order) {
        for (const item of order.items) {
            await this.bookModel.findByIdAndUpdate(item.book, { $inc: { soldCount: -item.quantity } });
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(book_schema_1.Book.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], OrdersService);
//# sourceMappingURL=orders.service.js.map