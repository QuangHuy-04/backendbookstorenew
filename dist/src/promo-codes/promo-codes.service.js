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
exports.PromoCodesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const promo_code_schema_1 = require("./schemas/promo-code.schema");
let PromoCodesService = class PromoCodesService {
    promoCodeModel;
    constructor(promoCodeModel) {
        this.promoCodeModel = promoCodeModel;
    }
    async create(createPromoCodeDto) {
        const createdPromoCode = new this.promoCodeModel(createPromoCodeDto);
        return createdPromoCode.save();
    }
    async findAll() {
        return this.promoCodeModel.find().exec();
    }
    async findOne(code) {
        const promoCode = await this.promoCodeModel.findOne({ code: code.toUpperCase() }).exec();
        if (!promoCode) {
            throw new common_1.NotFoundException(`Promo code ${code} not found`);
        }
        return promoCode;
    }
    async validate(code, orderValue) {
        const promoCode = await this.findOne(code);
        if (!promoCode.isActive) {
            throw new common_1.BadRequestException('Promo code is inactive');
        }
        const now = new Date();
        if (now < promoCode.startDate || now > promoCode.endDate) {
            throw new common_1.BadRequestException('Promo code is expired or not yet active');
        }
        if (promoCode.usageLimit > 0 && promoCode.usedCount >= promoCode.usageLimit) {
            throw new common_1.BadRequestException('Promo code usage limit reached');
        }
        if (orderValue < promoCode.minOrderValue) {
            throw new common_1.BadRequestException(`Minimum order value of ${promoCode.minOrderValue} required`);
        }
        return promoCode;
    }
    async apply(code) {
        await this.promoCodeModel.updateOne({ code: code.toUpperCase() }, { $inc: { usedCount: 1 } }).exec();
    }
    async remove(id) {
        const result = await this.promoCodeModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Promo code with ID ${id} not found`);
        }
    }
};
exports.PromoCodesService = PromoCodesService;
exports.PromoCodesService = PromoCodesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(promo_code_schema_1.PromoCode.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PromoCodesService);
//# sourceMappingURL=promo-codes.service.js.map