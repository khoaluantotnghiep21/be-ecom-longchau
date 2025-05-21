import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DanhMuc } from "./category.entity";
import { DanhMucController } from "./category.controller";
import { DanhMucService } from "./category.service";
import { AuthGuard } from "src/guards/auth.guards";
import { Loai } from "../Loai/loai.entity";

@Module({
    imports: [
        SequelizeModule.forFeature([DanhMuc, Loai]),
    ],
    controllers: [DanhMucController],
    providers: [DanhMucService, AuthGuard],
    exports: [AuthGuard]
})
export class DanhMucModule {}