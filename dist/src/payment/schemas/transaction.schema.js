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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionSchema = exports.Transaction = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Transaction = class Transaction extends mongoose_2.Document {
    order;
    provider;
    transactionId;
    amount;
    status;
    rawResponse;
    errorMessage;
};
exports.Transaction = Transaction;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Order', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Transaction.prototype, "order", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['vnpay', 'momo'], required: true }),
    __metadata("design:type", String)
], Transaction.prototype, "provider", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Transaction.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['pending', 'success', 'failed', 'cancelled'],
        default: 'pending',
    }),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Transaction.prototype, "rawResponse", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Transaction.prototype, "errorMessage", void 0);
exports.Transaction = Transaction = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Transaction);
exports.TransactionSchema = mongoose_1.SchemaFactory.createForClass(Transaction);
//# sourceMappingURL=transaction.schema.js.map