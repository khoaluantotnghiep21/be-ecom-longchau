import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserRoleService } from "./userrole.service";
import { Public } from "src/common/decorator/public.decorator";
import { UserRoleDto } from "./dto/userrole.dto";
import { UserRole } from "./userrole.entity";
import { UUID } from "crypto";
@ApiTags('UserRole')
@Controller('UserRole')
export class UserRoleController {
    constructor(
        private readonly userRoleService: UserRoleService
    ) { }

    @Public()
    @Post('createUserRole')
    async createUserRole(@Body() userRoleDto: UserRoleDto): Promise<UserRole> {
        return this.userRoleService.createUserRole(userRoleDto)
    }

    @Public()
    @Put('updateUserRole/:userid/:roleid')
    async updateUserRole(@Param('userid') userid: UUID, @Param('roleid') roleid: UUID): Promise<UserRole> {
        return this.userRoleService.updateUserRole(userid, roleid)
    }

    @Public()
    @Get('getUserRoles/:userid')
    async findUserByRoleId(@Param('userid') userid: UUID) {
        return this.userRoleService.getAllRolesByUserId(userid)
    }
}
