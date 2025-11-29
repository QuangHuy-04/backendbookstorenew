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
exports.StatsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const book_schema_1 = require("../books/schemas/book.schema");
const order_schema_1 = require("../orders/schemas/order.schema");
let StatsController = class StatsController {
    bookModel;
    orderModel;
    constructor(bookModel, orderModel) {
        this.bookModel = bookModel;
        this.orderModel = orderModel;
    }
    async getDashboardStats() {
        const totalBooks = await this.bookModel.countDocuments();
        const totalOrders = await this.orderModel.countDocuments();
        const revenueResult = await this.orderModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$total' }
                }
            }
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;
        const recentOrders = await this.orderModel
            .find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name email')
            .populate('items.book', 'title')
            .exec();
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
};
exports.StatsController = StatsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getDashboardStats", null);
exports.StatsController = StatsController = __decorate([
    (0, common_1.Controller)('stats'),
    __param(0, (0, mongoose_1.InjectModel)(book_schema_1.Book.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], StatsController);
//# sourceMappingURL=stats.controller.js.map