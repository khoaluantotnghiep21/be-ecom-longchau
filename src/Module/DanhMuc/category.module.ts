import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DanhMuc } from "./category.entity";
import { DanhMucController } from "./category.controller";
import { DanhMucService } from "./category.service";
import { AuthGuard } from "src/guards/auth.guards";

@Module({
    imports: [
        SequelizeModule.forFeature([DanhMuc]),
    ],
    controllers: [DanhMucController],
    providers: [DanhMucService, AuthGuard],
    exports: [AuthGuard]
})
export class DanhMucModule {}