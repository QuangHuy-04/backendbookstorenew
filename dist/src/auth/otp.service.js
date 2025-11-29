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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
let OtpService = class OtpService {
    otpStore = new Map();
    generateOTP() {
        return crypto.randomInt(100000, 999999).toString();
    }
    async storeOTP(email, otp) {
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5);
        this.otpStore.set(email, { code: otp, expires });
        setTimeout(() => {
            this.otpStore.delete(email);
        }, 5 * 60 * 1000);
    }
    async verifyOTP(email, otp) {
        const stored = this.otpStore.get(email);
        if (!stored) {
            return false;
        }
        if (new Date() > stored.expires) {
            this.otpStore.delete(email);
            return false;
        }
        if (stored.code !== otp) {
            return false;
        }
        this.otpStore.delete(email);
        return true;
    }
    generateResetToken() {
        return crypto.randomBytes(32).toString('hex');
    }
    async storeCaptcha(id, text) {
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5);
        this.otpStore.set(`captcha_${id}`, { code: text, expires });
        setTimeout(() => {
            this.otpStore.delete(`captcha_${id}`);
        }, 5 * 60 * 1000);
    }
    async verifyCaptcha(id, text) {
        const key = `captcha_${id}`;
        const stored = this.otpStore.get(key);
        if (!stored) {
            return false;
        }
        if (new Date() > stored.expires) {
            this.otpStore.delete(key);
            return false;
        }
        if (stored.code.toLowerCase() !== text.toLowerCase()) {
            return false;
        }
        this.otpStore.delete(key);
        return true;
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)()
], OtpService);
//# sourceMappingURL=otp.service.js.map