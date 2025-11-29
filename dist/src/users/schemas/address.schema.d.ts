import { Document, Types } from 'mongoose';
export declare class Address extends Document {
    user: Types.ObjectId;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    isDefault: boolean;
}
export declare const AddressSchema: import("mongoose").Schema<Address, import("mongoose").Model<Address, any, any, any, Document<unknown, any, Address, any, {}> & Address & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Address, Document<unknown, {}, import("mongoose").FlatRecord<Address>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Address> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
