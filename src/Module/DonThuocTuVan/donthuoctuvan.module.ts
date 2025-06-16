import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DonThuocTuVan } from './donthuoctuvan.entity';
import { DonThuocTuVanService } from './donthuoctuvan.service';
import { DonThuocTuVanController } from './donthuoctuvan.controller';
import { PurchaseOrder } from '../DonHang/purchaseOrder.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([DonThuocTuVan, PurchaseOrder]),
  ],
  controllers: [DonThuocTuVanController],
  providers: [DonThuocTuVanService],
  exports: [DonThuocTuVanService],
})
export class DonThuocTuVanModule {}
