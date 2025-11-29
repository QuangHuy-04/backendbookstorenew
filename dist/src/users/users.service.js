"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const address_schema_1 = require("./schemas/address.schema");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    userModel;
    addressModel;
    constructor(userModel, addressModel) {
        this.userModel = userModel;
        this.addressModel = addressModel;
    }
    async findOne(id) {
        return this.userModel.findById(id).exec();
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findByGoogleId(googleId) {
        return this.userModel.findOne({ googleId }).exec();
    }
    async create(userData) {
        const user = new this.userModel(userData);
        return user.save();
    }
    async updatePassword(id, newPassword) {
        return this.userModel
            .findByIdAndUpdate(id, { password: newPassword }, { new: true })
            .exec();
    }
    async updateGoogleId(id, googleId) {
        return this.userModel
            .findByIdAndUpdate(id, { googleId }, { new: true })
            .exec();
    }
    async findByResetToken(token) {
        return this.userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        }).exec();
    }
    async addToFavorites(userId, bookId) {
        return this.userModel
            .findByIdAndUpdate(userId, { $addToSet: { favorites: bookId } }, { new: true })
            .exec();
    }
    async removeFromFavorites(userId, bookId) {
        return this.userModel
            .findByIdAndUpdate(userId, { $pull: { favorites: bookId } }, { new: true })
            .exec();
    }
    async getFavorites(userId) {
        const user = await this.userModel
            .findById(userId)
            .populate('favorites')
            .exec();
        return user?.favorites || [];
    }
    async updateProfile(userId, updateData) {
        const user = await this.userModel.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select('-password').exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
    }
    async getAddresses(userId) {
        return this.addressModel.find({ user: userId }).exec();
    }
    async addAddress(userId, addressData) {
        if (addressData.isDefault) {
            await this.addressModel.updateMany({ user: userId }, { $set: { isDefault: false } });
        }
        const address = new this.addressModel({
            ...addressData,
            user: userId
        });
        return address.save();
    }
    async updateAddress(userId, addressId, addressData) {
        if (addressData.isDefault) {
            await this.addressModel.updateMany({ user: userId, _id: { $ne: addressId } }, { $set: { isDefault: false } });
        }
        const address = await this.addressModel.findOneAndUpdate({ _id: addressId, user: userId }, { $set: addressData }, { new: true }).exec();
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        return address;
    }
    async deleteAddress(userId, addressId) {
        const result = await this.addressModel.deleteOne({ _id: addressId, user: userId }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Address not found');
        }
    }
    async setDefaultAddress(userId, addressId) {
        await this.addressModel.updateMany({ user: userId }, { $set: { isDefault: false } });
        const address = await this.addressModel.findOneAndUpdate({ _id: addressId, user: userId }, { $set: { isDefault: true } }, { new: true }).exec();
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        return address;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(address_schema_1.Address.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map