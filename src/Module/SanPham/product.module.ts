import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SanPham } from "./product.entity";
import { SanPhamController } from "./product.controller";
import { SanPhamService } from "./product.service";
import { DanhMuc } from "../DanhMuc/category.entity";

@Module({
    imports: [
        SequelizeModule.forFeature([SanPham, DanhMuc]),
    ],
    controllers: [SanPhamController],
    providers: [SanPhamService],
})
export class SanPhamModule {}