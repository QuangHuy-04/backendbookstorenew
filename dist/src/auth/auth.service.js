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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const mail_service_1 = require("../mail/mail.service");
const otp_service_1 = require("./otp.service");
const bcrypt = __importStar(require("bcrypt"));
const svgCaptcha = __importStar(require("svg-captcha"));
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    usersService;
    jwtService;
    mailService;
    otpService;
    constructor(usersService, jwtService, mailService, otpService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.otpService = otpService;
    }
    async register(name, email, password) {
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            if (!existingUser.isActive) {
                const otp = this.otpService.generateOTP();
                await this.otpService.storeOTP(email, otp);
                await this.mailService.sendOTP(email, otp);
                return { message: 'OTP sent to email. Please verify to complete registration.', requireOtp: true };
            }
            throw new common_1.UnauthorizedException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.usersService.create({
            name,
            email,
            password: hashedPassword,
            isActive: false,
        });
        const otp = this.otpService.generateOTP();
        await this.otpService.storeOTP(email, otp);
        await this.mailService.sendOTP(email, otp);
        return { message: 'OTP sent to email. Please verify to complete registration.', requireOtp: true };
    }
    async verifyRegistration(email, otp) {
        const isValid = await this.otpService.verifyOTP(email, otp);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        }
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        user.isActive = true;
        await user.save();
        const payload = { email: user.email, sub: user._id, role: user.role };
        const access_token = this.jwtService.sign(payload);
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '30d' });
        return {
            access_token,
            refresh_token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
    async login(email, password, captcha, captchaId) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Thông tin đăng nhập không hợp lệ');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Tài khoản chưa được kích hoạt. Vui lòng xác nhận email.');
        }
        if (user.lockUntil && user.lockUntil > new Date()) {
            const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
            throw new common_1.UnauthorizedException(`Tài khoản bị khóa. Vui lòng thử lại sau ${minutesLeft} phút.`);
        }
        if ((user.failedLoginAttempts || 0) >= 3) {
            if (!captcha || !captchaId) {
                return { requireCaptcha: true, message: 'Yêu cầu CAPTCHA' };
            }
            const isCaptchaValid = await this.otpService.verifyCaptcha(captchaId, captcha);
            if (!isCaptchaValid) {
                throw new common_1.UnauthorizedException('CAPTCHA không hợp lệ');
            }
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
            if (user.failedLoginAttempts >= 5) {
                user.lockUntil = new Date(Date.now() + 10 * 60 * 1000);
            }
            await user.save();
            const attempts = user.failedLoginAttempts;
            if (attempts >= 5) {
                throw new common_1.UnauthorizedException('Tài khoản bị khóa 10 phút do quá nhiều lần đăng nhập không hợp lệ.');
            }
            else if (attempts >= 3) {
                return { requireCaptcha: true, message: 'Yêu cầu CAPTCHA' };
            }
            throw new common_1.UnauthorizedException('Thông tin đăng nhập không hợp lệ');
        }
        if (user.failedLoginAttempts > 0) {
            user.failedLoginAttempts = 0;
            user.lockUntil = null;
            await user.save();
        }
        const payload = { email: user.email, sub: user._id, role: user.role };
        const access_token = this.jwtService.sign(payload);
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '30d' });
        return {
            access_token,
            refresh_token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                failedLoginAttempts: user.failedLoginAttempts || 0,
            },
        };
    }
    async refresh(refreshToken) {
        try {
            const decoded = this.jwtService.verify(refreshToken);
            const user = await this.usersService.findOne(decoded.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            const payload = { email: user.email, sub: user._id, role: user.role };
            const access_token = this.jwtService.sign(payload);
            const new_refresh_token = this.jwtService.sign(payload, { expiresIn: '30d' });
            return {
                access_token,
                refresh_token: new_refresh_token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async validateUser(userId) {
        return this.usersService.findOne(userId);
    }
    generateToken(payload, expiresIn) {
        if (expiresIn) {
            return this.jwtService.sign(payload, { expiresIn });
        }
        return this.jwtService.sign(payload);
    }
    async sendOTP(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const otp = this.otpService.generateOTP();
        await this.otpService.storeOTP(email, otp);
        await this.mailService.sendOTP(email, otp);
        return { message: 'OTP sent to email' };
    }
    async verifyOTP(email, otp) {
        const isValid = await this.otpService.verifyOTP(email, otp);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        }
        return { message: 'OTP verified successfully' };
    }
    async forgotPassword(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return { message: 'If email exists, password reset link has been sent' };
        }
        const resetToken = this.otpService.generateResetToken();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        await user.save();
        await this.mailService.sendPasswordReset(email, resetToken);
        return { message: 'Password reset link sent to email' };
    }
    async resetPassword(token, newPassword) {
        const user = await this.usersService.findByResetToken(token);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        return { message: 'Password reset successfully' };
    }
    async generateCaptcha() {
        const captcha = svgCaptcha.create({
            size: 6,
            noise: 2,
            color: true,
            background: '#f0f0f0',
        });
        const id = crypto.randomUUID();
        await this.otpService.storeCaptcha(id, captcha.text);
        return {
            image: captcha.data,
            id: id,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        mail_service_1.MailService,
        otp_service_1.OtpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map