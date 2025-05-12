import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Role } from "./role.entity";
import { Repository } from "sequelize-typescript";
import { UUID } from "crypto";

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(Role)
        private readonly roleRepo: Repository<Role>,
    ) {}

    async findAll(): Promise<Role[]> {
        return await this.roleRepo.findAll();
    }
    async createRole(namerole: string): Promise<Role> {
        const data = { namerole };
        return await this.roleRepo.create(data);
    }
    async updateRole(id: UUID, namerole: string): Promise<Role> {
        const role = await this.roleRepo.findOne({ where: { id } });
        if (!role) {
            throw new Error('Role not found');
        }
        role.namerole = namerole;
        return await role.save();
    }
}