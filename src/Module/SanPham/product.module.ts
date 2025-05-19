import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SanPham } from './product.entity';
import { SanPhamController } from './product.controller';
import { SanPhamService } from './product.service';
import { DanhMuc } from '../DanhMuc/category.entity';
import { ThuongHieu } from '../ThuongHieu/thuonghieu.entity';
import { Media } from '../Media/media.entity';
import { Promotion } from '../ChuongTrinh/promotion.entity';
import { Unit } from '../DonViTinh/donvitinh.entity';
import { UnitDetals } from '../ChiTietDonViTinh/chitietdonvitinh.entity';
import { Ingredient } from '../ThanhPhan/ingredient.entity';
import { IngredientDetals } from '../ChiTietThanhPhan/ingredientDetals.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SanPham,
      DanhMuc,
      ThuongHieu,
      Media,
      Promotion,
      Unit,
      UnitDetals,
      Ingredient,
      IngredientDetals
    ]),
  ],
  controllers: [SanPhamController],
  providers: [SanPhamService],
})
export class SanPhamModule {}
