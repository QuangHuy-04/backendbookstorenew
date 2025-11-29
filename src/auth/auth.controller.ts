import { Controller, Post, Body, Get, UseGuards, Request, Res, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        return this.authService.register(name, email, password);
    }

    // Alias for register to match frontend
    @Post('signup')
    async signup(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        return this.authService.register(name, email, password);
    }

    @Post('verify-registration')
    async verifyRegistration(
        @Body('email') email: string,
        @Body('otp') otp: string,
    ) {
        return this.authService.verifyRegistration(email, otp);
    }

    @Get('captcha')
    async getCaptcha() {
        return this.authService.generateCaptcha();
    }

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Body('captcha') captcha?: string,
        @Body('captchaId') captchaId?: string,
    ) {
        return this.authService.login(email, password, captcha, captchaId);
    }

    @Post('refresh')
    async refresh(@Body('refreshToken') refreshToken: string) {
        return this.authService.refresh(refreshToken);
    }

    // Google OAuth routes
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // Guard redirects to Google
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthCallback(@Request() req, @Res() res) {
        // Generate JWT for the authenticated user
        const payload = { email: req.user.email, sub: req.user._id, role: req.user.role };
        const access_token = this.authService.generateToken(payload);
        const refresh_token = this.authService.generateToken(payload, '30d');

        // Redirect to frontend with tokens
        res.redirect(
            `${process.env.FRONTEND_URL}/auth/callback?access_token=${access_token}&refresh_token=${refresh_token}`
        );
    }

    // OTP endpoints
    @Post('send-otp')
    async sendOTP(@Body('email') email: string) {
        return this.authService.sendOTP(email);
    }

    @Post('verify-otp')
    async verifyOTP(
        @Body('email') email: string,
        @Body('otp') otp: string,
    ) {
        return this.authService.verifyOTP(email, otp);
    }

    // Password reset endpoints
    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email);
    }

    @Post('reset-password')
    async resetPassword(
        @Body('token') token: string,
        @Body('password') password: string,
    ) {
        return this.authService.resetPassword(token, password);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    // Alias for profile to match frontend expectations
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getCurrentUser(@Request() req) {
        // req.user comes from JWT strategy validation
        // It contains { userId, email, user }
        const user = req.user.user;

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
    }
}
