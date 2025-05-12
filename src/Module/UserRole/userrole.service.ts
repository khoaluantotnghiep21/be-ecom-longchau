import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserRole } from "./userrole.entity";
import { Repository } from "sequelize-typescript";
import { UUID } from "crypto";
import { Role } from "../Role/role.entity";
import { Sequelize } from "sequelize";

@Injectable()
export class UserRoleService {
    constructor(
        @InjectModel(UserRole)
        private readonly identityUserRepo: Repository<UserRole>,
        @InjectModel(Role)
        private readonly roleRepo: Repository<Role>,
        private readonly sequelize: Sequelize,
    ) {}
    async createUserRole(userid: UUID, roleid: UUID): Promise<UserRole> {
        const role = await this.roleRepo.findOne({ where: { id: roleid } });
        if (!role) {
            throw new Error('Role not found');
        }
        const data = { userid, roleid };
        return await this.identityUserRepo.create(data);
    }

    async updateUserRole(userid: UUID, roleid: UUID): Promise<UserRole> {
        const userRole = await this.identityUserRepo.findOne({ where: { userid } });
        if (!userRole) {
            throw new Error('UserRole not found');
        }
        const role = await this.roleRepo.findOne({ where: { id: roleid } });
        if (!role) {
            throw new Error('Role not found');
        }
        userRole.roleid = roleid;
        return await userRole.save();
    }
    
    async findUserByRoleId(roleid: UUID): Promise<UserRole[]> {
        const [result] = await this.sequelize.query(
            `
            SELECT 
            i.id AS user_id,
            i.hoten ,
            i.email,
            i.sodienthoai,
            r.namerole
            FROM userrole ur, identityuser i, role r
            WHERE ur.userid = i.id
            AND ur.roleid = r.id
            and ur.userid = '${roleid}';
            `

        )
        return result as UserRole[];
    }
}