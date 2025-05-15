import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserRole } from "./userrole.entity";
import { Role } from "../Role/role.entity";
import { UserRoleService } from "./userrole.service";
import { AuthGuard } from "src/guards/auth.guards";
import { UserRoleController } from "./userrole.controller";
import { IdentityUser } from "../IdentityUser/identityuser.entity";

@Module({
    imports:[SequelizeModule.forFeature([UserRole, Role, IdentityUser])],
    providers:[UserRoleService, AuthGuard],
    controllers: [UserRoleController],
    exports: [AuthGuard]
})

export class UserRoleModule{}