"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoCodesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const promo_codes_controller_1 = require("./promo-codes.controller");
const promo_codes_service_1 = require("./promo-codes.service");
const promo_code_schema_1 = require("./schemas/promo-code.schema");
const auth_module_1 = require("../auth/auth.module");
let PromoCodesModule = class PromoCodesModule {
};
exports.PromoCodesModule = PromoCodesModule;
exports.PromoCodesModule = PromoCodesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: promo_code_schema_1.PromoCode.name, schema: promo_code_schema_1.PromoCodeSchema }]),
            auth_module_1.AuthModule
        ],
        controllers: [promo_codes_controller_1.PromoCodesController],
        providers: [promo_codes_service_1.PromoCodesService],
        exports: [promo_codes_service_1.PromoCodesService],
    })
], PromoCodesModule);
//# sourceMappingURL=promo-codes.module.js.map