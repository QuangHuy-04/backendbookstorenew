import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
    private otpStore = new Map<string, { code: string; expires: Date }>();

    generateOTP(): string {
        return crypto.randomInt(100000, 999999).toString();
    }

    async storeOTP(email: string, otp: string): Promise<void> {
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5); // OTP valid for 5 minutes

        this.otpStore.set(email, { code: otp, expires });

        // Clean up expired OTPs
        setTimeout(() => {
            this.otpStore.delete(email);
        }, 5 * 60 * 1000);
    }

    async verifyOTP(email: string, otp: string): Promise<boolean> {
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

        // OTP is valid, remove it
        this.otpStore.delete(email);
        return true;
    }

    generateResetToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    // CAPTCHA methods
    async storeCaptcha(id: string, text: string): Promise<void> {
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5); // CAPTCHA valid for 5 minutes

        this.otpStore.set(`captcha_${id}`, { code: text, expires });

        // Clean up
        setTimeout(() => {
            this.otpStore.delete(`captcha_${id}`);
        }, 5 * 60 * 1000);
    }

    async verifyCaptcha(id: string, text: string): Promise<boolean> {
        const key = `captcha_${id}`;
        const stored = this.otpStore.get(key);

        if (!stored) {
            return false;
        }

        if (new Date() > stored.expires) {
            this.otpStore.delete(key);
            return false;
        }

        // Case insensitive comparison
        if (stored.code.toLowerCase() !== text.toLowerCase()) {
            return false;
        }

        // CAPTCHA used once, remove it
        this.otpStore.delete(key);
        return true;
    }
}
