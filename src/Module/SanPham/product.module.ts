import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SanPham } from './product.entity';
import { SanPhamController } from './product.controller';
import { SanPhamService } from './product.service';
import { DanhMuc } from '../DanhMuc/category.entity';
import { ThuongHieu } from '../ThuongHieu/thuonghieu.entity';
import { Media } from '../Media/media.entity';
import { Promotion } from '../ChuongTrinh/promotion.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SanPham,
      DanhMuc,
      ThuongHieu,
      Media,
      Promotion,
    ]),
  ],
  controllers: [SanPhamController],
  providers: [SanPhamService],
})
export class SanPhamModule {}
