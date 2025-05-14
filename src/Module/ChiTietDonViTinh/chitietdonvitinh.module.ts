import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UnitDetals } from "./chitietdonvitinh.entity";
import { SanPham } from "../SanPham/product.entity";
import { Unit } from "../DonViTinh/donvitinh.entity";
import { UnitDetalsSerive } from "./chitietdonvitinh.service";
import { AuthGuard } from "src/guards/auth.guards";
import { UnitDetalsController } from "./chitietdonvitinh.controller";

@Module({
    imports:[
        SequelizeModule.forFeature([UnitDetals, SanPham, Unit])
    ],
    providers:[UnitDetalsSerive, AuthGuard],
    controllers:[UnitDetalsController],
    exports:[AuthGuard]
})

export class UnitDetalsModule{}