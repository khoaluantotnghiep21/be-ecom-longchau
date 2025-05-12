import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ThuongHieu } from "./thuonghieu.entity";
import { ThuongHieuController } from "./thuonghieu.controller";
import { ThuongHieuService } from "./thuonghieu.service";
import { AuthGuard } from "src/guards/auth.guards";

@Module({
    imports: [
        SequelizeModule.forFeature([ThuongHieu]),
    ],
    controllers: [ThuongHieuController],
    providers: [ThuongHieuService, AuthGuard],
    exports: [AuthGuard]
})
export class ThuongHieuModule {}