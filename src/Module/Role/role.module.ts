import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Role } from "./role.entity";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import { AuthGuard } from "src/guards/auth.guards";

@Module({
    imports: [
        SequelizeModule.forFeature([Role]),
    ],
    controllers: [RoleController],
    providers: [RoleService, AuthGuard],
    exports: [AuthGuard]
})
export class RoleModule {}