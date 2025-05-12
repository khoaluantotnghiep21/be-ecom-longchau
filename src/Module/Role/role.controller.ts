import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { RoleService } from "./role.service";
import { Public } from "src/common/decorator/public.decorator";
import { UUID } from "crypto";

@Controller("role")
export class RoleController {
    constructor(
        private readonly roleService: RoleService, 
    ) {}

    @Public()
    @Get("getAllRoles")
    async getAllRoles() {
        const roles = await this.roleService.findAll();
        return roles;
    }

    @Public()
    @Post("createRole")
    async createRole(@Body() namerole: string) {
        const role = await this.roleService.createRole(namerole);
        return role;
    }

    @Public()
    @Put("updateRole/:id")
    async updateRole(@Param("id") id: UUID, @Body() namerole: string) {
        const role = await this.roleService.updateRole(id, namerole);
        return role;
    }
}

