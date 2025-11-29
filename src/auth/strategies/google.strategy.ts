import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
        private configService: ConfigService,
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || 'http://localhost:3001/api/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { id, name, emails, photos } = profile;

        // Check if user exists by Google ID
        let user = await this.usersService.findByGoogleId(id);

        if (!user) {
            // Check if user exists by email
            user = await this.usersService.findByEmail(emails[0].value);

            if (user) {
                // Link Google account to existing user
                await this.usersService.updateGoogleId(user._id.toString(), id);
                user.googleId = id;
            } else {
                // Create new user
                user = await this.usersService.create({
                    email: emails[0].value,
                    name: name.givenName + ' ' + name.familyName,
                    googleId: id,
                    // No password for OAuth users
                });
            }
        }

        done(null, user);
    }
}
