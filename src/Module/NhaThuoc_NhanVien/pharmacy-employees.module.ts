import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PharmacyEmployes } from './pharmacy-employees.entity';
import { PharmacyEmployeesService } from './pharmacy-employees.service';
import { PharmacyEmployeesController } from './pharmacy-employees.controller';
import { Pharmacy } from '../NhaThuoc/pharmacy.entity';
import { IdentityUser } from '../IdentityUser/identityuser.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([PharmacyEmployes, Pharmacy, IdentityUser])
  ],
  controllers: [PharmacyEmployeesController],
  providers: [PharmacyEmployeesService],
  exports: [PharmacyEmployeesService]
})
export class PharmacyEmployeesModule {}
