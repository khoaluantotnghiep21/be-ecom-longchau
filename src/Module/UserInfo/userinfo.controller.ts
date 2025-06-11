import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { UserInfoService } from './userinfo.service';
import { CreateUserDto } from './dto/create-userinfo.dto';
import { UpdateUserDto } from './dto/update-userinfo.dto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('UserInfo')
@Controller('UserInfo')
export class UserInfoController {
    constructor(private readonly userinfoService: UserInfoService) { }

    @Public()
    @Post()
    @ApiBody({ type: CreateUserDto })
    async createUser(@Body() dto: CreateUserDto) {
        return this.userinfoService.createUser(dto);
    }
    @Public()
    @Get()
    async getAllUsers() {
        return this.userinfoService.getAllUsers();
    }
    @Public()
    @Get('getUserInfo/:id')
    @ApiParam({ name: 'id', type: String })
    async getUserById(@Param('id') id: string) {
        return this.userinfoService.getUserById(id);
    }
    @Public()
    @Put('updateUserInfo/:id')
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: UpdateUserDto })
    async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.userinfoService.updateUser(id, dto);
    }
    
    @Public()
    @Delete('deleteUserInfo/:id')
    @ApiParam({ name: 'id', type: String })
    async deleteUser(@Param('id') id: string) {
        return this.userinfoService.deleteUser(id);
    }

    @Public()
    @Get('getUserInfoWithRoles/:id')
    @ApiParam({ name: 'id', type: String })
    async getUserWithRoles(@Param('id') id: string) {
        return this.userinfoService.getUserWithRoles(id);
    }
}