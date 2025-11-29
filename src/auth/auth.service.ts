import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { OtpService } from './otp.service';
import * as bcrypt from 'bcrypt';
import * as svgCaptcha from 'svg-captcha';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private mailService: MailService,
        private otpService: OtpService,
    ) { }

    async register(name: string, email: string, password: string) {
        // Check if user already exists
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            // If user exists but is not active (pending verification), resend OTP
            if (!existingUser.isActive) {
                const otp = this.otpService.generateOTP();
                await this.otpService.storeOTP(email, otp);
                await this.mailService.sendOTP(email, otp);
                return { message: 'OTP sent to email. Please verify to complete registration.', requireOtp: true };
            }
            throw new UnauthorizedException('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with isActive: false
        await this.usersService.create({
            name,
            email,
            password: hashedPassword,
            isActive: false, // User must verify OTP to activate
        });

        // Generate and send OTP
        const otp = this.otpService.generateOTP();
        await this.otpService.storeOTP(email, otp);
        await this.mailService.sendOTP(email, otp);

        return { message: 'OTP sent to email. Please verify to complete registration.', requireOtp: true };
    }

    async verifyRegistration(email: string, otp: string) {
        const isValid = await this.otpService.verifyOTP(email, otp);
        if (!isValid) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        user.isActive = true;
        await user.save();

        // Generate tokens
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

    async login(email: string, password: string, captcha?: string, captchaId?: string) {
        // Find user
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
        }

        // Check if account is active
        if (!user.isActive) {
            throw new UnauthorizedException('Tài khoản chưa được kích hoạt. Vui lòng xác nhận email.');
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > new Date()) {
            const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
            throw new UnauthorizedException(`Tài khoản bị khóa. Vui lòng thử lại sau ${minutesLeft} phút.`);
        }

        // Check if CAPTCHA is required (after 3 failed attempts)
        if ((user.failedLoginAttempts || 0) >= 3) {
            if (!captcha || !captchaId) {
                return { requireCaptcha: true, message: 'Yêu cầu CAPTCHA' };
            }

            const isCaptchaValid = await this.otpService.verifyCaptcha(captchaId, captcha);
            if (!isCaptchaValid) {
                throw new UnauthorizedException('CAPTCHA không hợp lệ');
            }
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            // Increment failed attempts
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

            // Lock account after 5 failed attempts
            if (user.failedLoginAttempts >= 5) {
                user.lockUntil = new Date(Date.now() + 10 * 60 * 1000); // Lock for 10 minutes
            }

            await user.save();

            const attempts = user.failedLoginAttempts;
            if (attempts >= 5) {
                throw new UnauthorizedException('Tài khoản bị khóa 10 phút do quá nhiều lần đăng nhập không hợp lệ.');
            } else if (attempts >= 3) {
                return { requireCaptcha: true, message: 'Yêu cầu CAPTCHA' };
            }

            throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
        }

        // Reset failed attempts on successful login
        if (user.failedLoginAttempts > 0) {
            user.failedLoginAttempts = 0;
            user.lockUntil = null as any; // TypeScript workaround
            await user.save();
        }

        // Generate tokens
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

    async refresh(refreshToken: string) {
        try {
            // Verify refresh token
            const decoded = this.jwtService.verify(refreshToken);

            // Get user
            const user = await this.usersService.findOne(decoded.sub);
            if (!user) {
                throw new UnauthorizedException('Invalid token');
            }

            // Generate new tokens
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
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async validateUser(userId: string) {
        return this.usersService.findOne(userId);
    }

    // Helper method for generating tokens (used by Google OAuth)
    generateToken(payload: any, expiresIn?: string) {
        if (expiresIn) {
            return this.jwtService.sign(payload, { expiresIn } as any);
        }
        return this.jwtService.sign(payload);
    }

    // OTP Methods
    async sendOTP(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const otp = this.otpService.generateOTP();
        await this.otpService.storeOTP(email, otp);
        await this.mailService.sendOTP(email, otp);

        return { message: 'OTP sent to email' };
    }

    async verifyOTP(email: string, otp: string) {
        const isValid = await this.otpService.verifyOTP(email, otp);
        if (!isValid) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        return { message: 'OTP verified successfully' };
    }

    // Password Reset Methods
    async forgotPassword(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            // Don't reveal if email exists
            return { message: 'If email exists, password reset link has been sent' };
        }

        const resetToken = this.otpService.generateResetToken();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        await this.mailService.sendPasswordReset(email, resetToken);

        return { message: 'Password reset link sent to email' };
    }

    async resetPassword(token: string, newPassword: string) {
        // Find user by token
        const user = await this.usersService.findByResetToken(token);

        if (!user) {
            throw new UnauthorizedException('Invalid or expired reset token');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = null as any;
        user.resetPasswordExpires = null as any;
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
}
