import { Document, Types } from 'mongoose';
export declare class Review extends Document {
    user: Types.ObjectId;
    book: Types.ObjectId;
    rating: number;
    comment: string;
}
export declare const ReviewSchema: import("mongoose").Schema<Review, import("mongoose").Model<Review, any, any, any, Document<unknown, any, Review, any, {}> & Review & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Review, Document<unknown, {}, import("mongoose").FlatRecord<Review>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Review> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
