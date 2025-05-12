import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IdentityUser } from "./identityuser.entity";
import { Repository } from "sequelize-typescript";
import { UserRole } from "../UserRole/userrole.entity";
import { Role } from "../Role/role.entity";
import { SignInDto } from "./dto/signIn.dto";
import { JwtService } from "@nestjs/jwt";
import { CreateAccountDto } from "./dto/createAccount.dto";
import * as bcrypt from "bcrypt";
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
    ) {}

    async createAccount(createAccountDto: CreateAccountDto): Promise<UserRole> {
        const salt = await bcrypt.genSalt(10);    
        const hashedPassword = await bcrypt.hash(createAccountDto.matkhau, salt);
        const data = {...createAccountDto, matkhau: hashedPassword}
        await this.identityUserRepo.create(data);
        const role = await this.roleRepo.findOne({ where: { namerole: 'customer' } });
        if (!role) {
            throw new Error('Role not found');
        }
        const user = await this.identityUserRepo.findOne({ where: { sodienthoai: createAccountDto.sodienthoai } });
        if (!user) {
            throw new Error('User not found');
        }

        const userRole = await this.userRoleRepo.create({ userid: user.dataValues.id, roleid: role.dataValues.id });
        return userRole;
    }
    
    async SignIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
        const user = await this.identityUserRepo.findOne({ where: { sodienthoai: signInDto.sodienthoai } });
        if (!user) {
            throw new Error('Not found user');
        }
    
        const userRoles = await this.userRoleRepo.findAll({ where: { userid: user.dataValues.id } });
        if (!userRoles || userRoles.length === 0) {
            throw new Error('Not found user role');
        }
    
        const roleIds = userRoles.map(userRole => userRole.dataValues.roleid);
    
        const roles = await this.roleRepo.findAll({ where: { id: roleIds } });
        if (!roles || roles.length === 0) {
            throw new Error('User not have role');
        }
    
        const nameroles = roles.map(role => role.dataValues.namerole);
    
        const payload = { sub: user.dataValues.id, roles: nameroles };
    
        return {
            accessToken: await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
            }),
        };
    }
}