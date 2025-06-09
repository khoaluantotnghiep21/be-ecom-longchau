import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GiaoHang } from './delivery.entity';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { PurchaseOrder } from '../DonHang/purchaseOrder.entity';
import { AuthGuard } from 'src/guards/auth.guards';
import { RolesGuard } from 'src/guards/roles.guard';

@Module({
  imports: [SequelizeModule.forFeature([GiaoHang, PurchaseOrder])],
  controllers: [DeliveryController],
  providers: [DeliveryService, AuthGuard, RolesGuard],
  exports: [DeliveryService],
})
export class DeliveryModule {}
