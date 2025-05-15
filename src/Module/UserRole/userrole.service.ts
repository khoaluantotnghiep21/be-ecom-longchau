import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserRole } from "./userrole.entity";
import { Repository, Sequelize } from "sequelize-typescript";
import { Role } from "../Role/role.entity";
import { UserRoleDto } from "./dto/userrole.dto";
import { UUID } from "crypto";
import { QueryTypes } from "sequelize";

@Injectable()
export class UserRoleService {
    constructor(
        @InjectModel(UserRole)
        private readonly identityUserRepo: Repository<UserRole>,
        @InjectModel(Role)
        private readonly roleRepo: Repository<Role>,
        private readonly sequelize: Sequelize
    ) {}
    async createUserRole(userroleDto: UserRoleDto): Promise<UserRole> {
        const role = await this.roleRepo.findOne({ where: { id: userroleDto.roleid} });
        if (!role) {
            throw new Error('Role not found');
        }
        const data = {...userroleDto };
        return await this.identityUserRepo.create(data);
    }

    async updateUserRole( userid: UUID, roleid: UUID): Promise<UserRole> {
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
    
    async getAllRolesByUserId(userid: string): Promise<{ role: Role; hoten: string }[]> {
        const roles = await this.sequelize.query(
            `
            SELECT r.*, s.hoten
            FROM userrole ur
            JOIN role r ON ur.roleid = r.id
            JOIN identityuser s ON ur.userid = s.id
            WHERE ur.userid = :userid
            `,
            {
                replacements: { userid },
                type: QueryTypes.SELECT,
            }
        );
    
        return roles as { role: Role; hoten: string }[];
    }
      
}