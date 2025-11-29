import { PromoCodesService } from './promo-codes.service';
export declare class PromoCodesController {
    private readonly promoCodesService;
    constructor(promoCodesService: PromoCodesService);
    create(createPromoCodeDto: any): Promise<import("./schemas/promo-code.schema").PromoCode>;
    findAll(): Promise<import("./schemas/promo-code.schema").PromoCode[]>;
    validate(code: string, orderValue: number): Promise<import("./schemas/promo-code.schema").PromoCode>;
    remove(id: string): Promise<void>;
}
