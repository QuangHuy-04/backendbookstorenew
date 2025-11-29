import { Document } from 'mongoose';
export type PromoCodeDocument = PromoCode & Document;
export declare class PromoCode {
    code: string;
    type: string;
    value: number;
    minOrderValue: number;
    maxDiscount?: number;
    startDate: Date;
    endDate: Date;
    usageLimit: number;
    usedCount: number;
    isActive: boolean;
}
export declare const PromoCodeSchema: import("mongoose").Schema<PromoCode, import("mongoose").Model<PromoCode, any, any, any, Document<unknown, any, PromoCode, any, {}> & PromoCode & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PromoCode, Document<unknown, {}, import("mongoose").FlatRecord<PromoCode>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<PromoCode> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
