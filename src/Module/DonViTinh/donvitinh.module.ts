import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Unit } from "./donvitinh.entity";
import { UnitController } from "./donvitinh.controller";
import { UnitService } from "./donvitinh.service";
import { AuthGuard } from "src/guards/auth.guards";

@Module({
    imports:[SequelizeModule.forFeature([Unit])],
    controllers:[UnitController],
    providers:[UnitService, AuthGuard],
    exports:[AuthGuard]
})

export class UnitModule{}