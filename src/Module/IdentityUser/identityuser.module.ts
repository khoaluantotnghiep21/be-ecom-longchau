import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { IdentityUser } from "./identityuser.entity";
import { Role } from "../Role/role.entity";
import { UserRole } from "../UserRole/userrole.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { IdentityUserController } from "./identityuser.controller";
import { IdentityUserService } from "./identityuser.service";
import { AuthGuard } from "src/guards/auth.guards";

@Module({
    imports: [
        SequelizeModule.forFeature([IdentityUser, Role, UserRole]),
        JwtModule.registerAsync({
            global: true,
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              secret: '0606ed6e14c2aaff454f1313b8632c75b22047eddfe90f8a47e6f2684b8a4cd6',
              signOptions: {
                expiresIn: '1d',
              },
            }),
          })
    ],
    controllers: [IdentityUserController],
    providers: [IdentityUserService, AuthGuard],
    exports: [AuthGuard],
})
export class IdentityUserModule {}