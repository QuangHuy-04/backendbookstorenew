import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PromoCode, PromoCodeDocument } from './schemas/promo-code.schema';

@Injectable()
export class PromoCodesService {
    constructor(@InjectModel(PromoCode.name) private promoCodeModel: Model<PromoCodeDocument>) { }

    async create(createPromoCodeDto: any): Promise<PromoCode> {
        const createdPromoCode = new this.promoCodeModel(createPromoCodeDto);
        return createdPromoCode.save();
    }

    async findAll(): Promise<PromoCode[]> {
        return this.promoCodeModel.find().exec();
    }

    async findOne(code: string): Promise<PromoCode> {
        const promoCode = await this.promoCodeModel.findOne({ code: code.toUpperCase() }).exec();
        if (!promoCode) {
            throw new NotFoundException(`Promo code ${code} not found`);
        }
        return promoCode;
    }

    async validate(code: string, orderValue: number): Promise<PromoCode> {
        const promoCode = await this.findOne(code);

        if (!promoCode.isActive) {
            throw new BadRequestException('Promo code is inactive');
        }

        const now = new Date();
        if (now < promoCode.startDate || now > promoCode.endDate) {
            throw new BadRequestException('Promo code is expired or not yet active');
        }

        if (promoCode.usageLimit > 0 && promoCode.usedCount >= promoCode.usageLimit) {
            throw new BadRequestException('Promo code usage limit reached');
        }

        if (orderValue < promoCode.minOrderValue) {
            throw new BadRequestException(`Minimum order value of ${promoCode.minOrderValue} required`);
        }

        return promoCode;
    }

    async apply(code: string): Promise<void> {
        // Increment used count
        await this.promoCodeModel.updateOne(
            { code: code.toUpperCase() },
            { $inc: { usedCount: 1 } }
        ).exec();
    }

    async remove(id: string): Promise<void> {
        const result = await this.promoCodeModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Promo code with ID ${id} not found`);
        }
    }
}
