import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';

const expressApp = express();

async function bootstrap() {
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
    );

    app.enableCors({
        origin: [
            process.env.FRONTEND_URL || 'http://localhost:3000',
            'https://quanghuy274.id.vn',
        ],
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    app.setGlobalPrefix('api');

    await app.init();
}

bootstrap();

export default expressApp;
