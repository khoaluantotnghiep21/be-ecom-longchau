import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserRoleService } from "./userrole.service";
import { Public } from "src/common/decorator/public.decorator";
import { UserRoleDto } from "./dto/userrole.dto";
import { UserRole } from "./userrole.entity";
import { UUID } from "crypto";
import { UserWithRolesDto } from "./dto/user-with-roles.dto";
import { Roles } from "src/common/decorator/roles.decorator";
import { Role as RoleEnum } from "src/common/Enum/role.enum";
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
    @Get('getUserRoles/:userid')
    @ApiOperation({ summary: 'Lấy tất cả vai trò của một người dùng' })
    
    async findUserByRoleId(@Param('userid') userid: UUID) {
        return this.userRoleService.getAllRolesByUserId(userid);
    }

    @Public()
    @Post('assignRoles')
    @ApiOperation({ summary: 'Gán nhiều vai trò cho một người dùng' })
    @ApiBody({ type: UserWithRolesDto })
    
    async assignMultipleRolesToUser(@Body() userWithRolesDto: UserWithRolesDto) {
        return this.userRoleService.assignMultipleRolesToUser(userWithRolesDto);
    }

    @Public()
    @Put('updateRoles')
    @ApiOperation({ summary: 'Cập nhật vai trò của một người dùng' })
    @ApiBody({ type: UserWithRolesDto })
    
    async updateUserRoles(@Body() userWithRolesDto: UserWithRolesDto) {
        return this.userRoleService.updateUserRoles(userWithRolesDto);
    }

    @Public()
    @Post('addRole')
    @ApiOperation({ summary: 'Thêm một vai trò cho người dùng' })
    @ApiBody({ type: UserRoleDto })
   
    async addRoleToUser(@Body() userRoleDto: UserRoleDto) {
        return this.userRoleService.addRoleToUser(userRoleDto);
    }

    @Public()
    @Delete('removeRole/:userid/:roleid')
    @ApiOperation({ summary: 'Xóa một vai trò khỏi người dùng' })
    @ApiParam({ name: 'userid', description: 'ID của người dùng' })
    @ApiParam({ name: 'roleid', description: 'ID của vai trò cần xóa' })
    
    async removeRoleFromUser(
        @Param('userid') userid: UUID,
        @Param('roleid') roleid: UUID
    ) {
        return this.userRoleService.removeRoleFromUser(userid, roleid);
    }
}
