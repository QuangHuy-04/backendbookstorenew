import { Document, Types } from 'mongoose';
export declare class Transaction extends Document {
    order: Types.ObjectId;
    provider: string;
    transactionId: string;
    amount: number;
    status: string;
    rawResponse: any;
    errorMessage: string;
}
export declare const TransactionSchema: import("mongoose").Schema<Transaction, import("mongoose").Model<Transaction, any, any, any, Document<unknown, any, Transaction, any, {}> & Transaction & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Transaction, Document<unknown, {}, import("mongoose").FlatRecord<Transaction>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Transaction> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
