import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NhaThuoc_SanPham } from './pharmacy-product.entity';
import { PharmacyProductService } from './pharmacy-product.service';
import { PharmacyProductController } from './pharmacy-product.controller';
import { SanPham } from '../SanPham/product.entity';
import { IdentityUser } from '../IdentityUser/identityuser.entity';
import { AuthGuard } from 'src/guards/auth.guards';
import { RolesGuard } from 'src/guards/roles.guard';

@Module({
  imports: [SequelizeModule.forFeature([NhaThuoc_SanPham, SanPham, IdentityUser])],
  controllers: [PharmacyProductController],
  providers: [PharmacyProductService, AuthGuard, RolesGuard],
  exports: [PharmacyProductService],
})
export class PharmacyProductModule {}
