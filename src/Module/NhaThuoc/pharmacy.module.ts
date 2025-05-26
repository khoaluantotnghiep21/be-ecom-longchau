import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Pharmacy } from './pharmacy.entity';
import { PharmacyService } from './pharmacy.service';
import { PharmacyController } from './pharmacy.controller';

@Module({
  imports: [SequelizeModule.forFeature([Pharmacy])],
  providers: [PharmacyService],
  controllers: [PharmacyController],
})
export class PharmacyModule {}
