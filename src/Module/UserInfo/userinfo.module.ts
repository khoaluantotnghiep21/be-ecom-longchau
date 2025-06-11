import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserInfo } from './userinfo.entity';
import { UserInfoService } from './userinfo.service';
import { UserInfoController } from './userinfo.controller';
import { UserRole } from '../UserRole/userrole.entity';
import { Role } from '../Role/role.entity';

@Module({
  imports: [SequelizeModule.forFeature([UserInfo, UserRole, Role])],
  providers: [UserInfoService],
  controllers: [UserInfoController],
})
export class UserInfoModule {}