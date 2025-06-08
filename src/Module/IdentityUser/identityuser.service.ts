import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IdentityUser } from './identityuser.entity';
import { Repository } from 'sequelize-typescript';
import { UserRole } from '../UserRole/userrole.entity';
import { Role } from '../Role/role.entity';
import { SignInDto } from './dto/signIn.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateAccountDto } from './dto/createAccount.dto';
import * as bcrypt from 'bcrypt';
import { UpdateIdentityUserDto } from './dto/updateIdentityUser.dto';
@Injectable()
export class IdentityUserService {
  constructor(
    @InjectModel(IdentityUser)
    private readonly identityUserRepo: Repository<IdentityUser>,
    @InjectModel(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
    @InjectModel(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly jwtService: JwtService,
  ) { }

  async isPhoneNumberExist(phoneNumber: string): Promise<boolean> {
    const user = await this.identityUserRepo.findOne({
      where: { sodienthoai: phoneNumber },
    });
    return !!user;
  }

  async getAllUsers(): Promise<IdentityUser[]> {
    return this.identityUserRepo.findAll({
      attributes: { exclude: ['matkhau'] },
    });
  }

  async changePassword(sodienthoai: string, oldPassword: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.identityUserRepo.findOne({ where: { sodienthoai } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await bcrypt.compare(oldPassword, user.matkhau);
    if (!isMatch) {
      throw new NotFoundException('Old password is incorrect');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.matkhau = hashedPassword;
    await user.save();
    return { message: 'Password changed successfully' };
  }

  async getUserByPhoneNumber(phoneNumber: string) {
    const user = await this.identityUserRepo.findOne({
      where: { sodienthoai: phoneNumber },
      attributes: { exclude: ['matkhau'] },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async createAccount(createAccountDto: CreateAccountDto): Promise<UserRole> {
    const phoneExists = await this.isPhoneNumberExist(
      createAccountDto.sodienthoai,
    );
    if (phoneExists) {
      throw new Error('Phone number already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createAccountDto.matkhau, salt);
    const data = { ...createAccountDto, matkhau: hashedPassword };
    await this.identityUserRepo.create(data);
    const role = await this.roleRepo.findOne({
      where: { namerole: 'customer' },
    });
    if (!role) {
      throw new Error('Role not found');
    }
    const user = await this.identityUserRepo.findOne({
      where: { sodienthoai: createAccountDto.sodienthoai },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const userRole = await this.userRoleRepo.create({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      userid: user.dataValues.id,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      roleid: role.dataValues.id,
    });
    return userRole;
  }

  async SignIn(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string; roles: string[] }> {
    const user = await this.identityUserRepo.findOne({
      where: { sodienthoai: signInDto.sodienthoai },
    });
    if (!user) {
      throw new Error('Not found user');
    }
    const password = user.dataValues.matkhau;
    const isPasswordValid = await bcrypt.compare(signInDto.matkhau, password)
    if (!isPasswordValid) {
      throw new NotFoundException('Account information not found')
    }
    const userRoles = await this.userRoleRepo.findAll({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where: { userid: user.dataValues.id },
    });
    if (!userRoles || userRoles.length === 0) {
      throw new Error('Not found user role');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    const roleIds = userRoles.map((userRole) => userRole.dataValues.roleid);

    const roles = await this.roleRepo.findAll({ where: { id: roleIds } });
    if (!roles || roles.length === 0) {
      throw new Error('User not have role');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    const nameroles = roles.map((role) => role.dataValues.namerole) as string[];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const payload = { sub: user.dataValues.id, numberPhone: user.dataValues.sodienthoai, nameuser: user.dataValues.hoten, roles: nameroles };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      roles: nameroles,
    };
  }

  async updateUser(updateUserDto: UpdateIdentityUserDto, sodienthoai: string): Promise<IdentityUser> {
    const user = await this.identityUserRepo.findOne({
      where: { sodienthoai },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.set(updateUserDto);
    return await user.save();
  }
}
