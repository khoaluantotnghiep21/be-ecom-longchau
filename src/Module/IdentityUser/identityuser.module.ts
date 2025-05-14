import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IdentityUser } from './identityuser.entity';
import { Role } from '../Role/role.entity';
import { UserRole } from '../UserRole/userrole.entity';

import { IdentityUserController } from './identityuser.controller';
import { IdentityUserService } from './identityuser.service';
import { AuthGuard } from 'src/guards/auth.guards';

@Module({
  imports: [SequelizeModule.forFeature([IdentityUser, Role, UserRole])],
  controllers: [IdentityUserController],
  providers: [IdentityUserService, AuthGuard],
  exports: [AuthGuard],
})
export class IdentityUserModule {}
