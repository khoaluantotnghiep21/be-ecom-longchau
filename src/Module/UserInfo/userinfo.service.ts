import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserInfo } from './userinfo.entity';
import { CreateUserDto } from './dto/create-userinfo.dto';
import { UpdateUserDto } from './dto/update-userinfo.dto';
import { UserRole } from '../UserRole/userrole.entity';
import { Role } from '../Role/role.entity';

@Injectable()
export class UserInfoService {
    constructor(
        @InjectModel(UserInfo)
        private readonly userinfoRepo: typeof UserInfo,
    ) { }

    async createUser(dto: CreateUserDto): Promise<UserInfo> {
        return this.userinfoRepo.create(dto as any);
    }

    async getAllUsers(): Promise<UserInfo[]> {
        return this.userinfoRepo.findAll();
    }

    async getUserById(id: string): Promise<UserInfo> {
        const userinfo = await this.userinfoRepo.findByPk(id);
        if (!userinfo) throw new NotFoundException('User not found');
        return userinfo;
    }

    async updateUser(id: string, dto: UpdateUserDto) {
        const user = await this.userinfoRepo.findByPk(id);
        if (!user) throw new NotFoundException('User not found');
        await user.update(dto);

        // Nếu có roleids thì update luôn role
        if (dto.roleids) {
            // Xóa hết role cũ
            await UserRole.destroy({ where: { userid: id } });
            // Thêm role mới
            for (const roleid of dto.roleids) {
                await UserRole.create({ userid: id, roleid });
            }
        }
        // Trả về user mới kèm role
        return this.getUserWithRoles(id);
    }

    async deleteUser(id: string): Promise<{ message: string }> {
        const userinfo = await this.getUserById(id);
        await userinfo.destroy();
        return { message: 'User deleted successfully' };
    }
    async getUserWithRoles(id: string) {
        return this.userinfoRepo.findOne({
            where: { id },
            include: [
                {
                    model: UserRole,
                    include: [Role]
                }
            ]
        });
    }
}
