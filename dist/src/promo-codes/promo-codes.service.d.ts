import { Model } from 'mongoose';
import { PromoCode, PromoCodeDocument } from './schemas/promo-code.schema';
export declare class PromoCodesService {
    private promoCodeModel;
    constructor(promoCodeModel: Model<PromoCodeDocument>);
    create(createPromoCodeDto: any): Promise<PromoCode>;
    findAll(): Promise<PromoCode[]>;
    findOne(code: string): Promise<PromoCode>;
    validate(code: string, orderValue: number): Promise<PromoCode>;
    apply(code: string): Promise<void>;
    remove(id: string): Promise<void>;
}
