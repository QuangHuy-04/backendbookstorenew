import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromoCodesController } from './promo-codes.controller';
import { PromoCodesService } from './promo-codes.service';
import { PromoCode, PromoCodeSchema } from './schemas/promo-code.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: PromoCode.name, schema: PromoCodeSchema }]),
        AuthModule
    ],
    controllers: [PromoCodesController],
    providers: [PromoCodesService],
    exports: [PromoCodesService],
})
export class PromoCodesModule { }
