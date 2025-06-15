import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { IdentityUserService } from './identityuser.service';
import { Public } from 'src/common/decorator/public.decorator';
import { SignInDto } from './dto/signIn.dto';
import { CreateAccountDto } from './dto/createAccount.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateIdentityUserDto } from './dto/updateIdentityUser.dto';


@ApiBearerAuth('access-token')
@ApiTags('IdentityUser')
@Controller('identityuser')
export class IdentityUserController {
  constructor(private readonly identityUserService: IdentityUserService) { }

  @Public()
  @Post('createAccount')
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    const newAccount =
      await this.identityUserService.createAccount(createAccountDto);
    return newAccount;
  }

  @Public()
  @Post('signIn')
  async signIn(@Body() signInDto: SignInDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.identityUserService.SignIn(signInDto);
    return result;
  }

  @Public()
  @Get('getUserByPhone/:phoneNumber')
  @ApiParam({
    name: 'phoneNumber',
    type: String,
    description: 'Số điện thoại của người dùng',
  })
  async getUserByPhone(@Param('phoneNumber') phoneNumber: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user =
      await this.identityUserService.getUserByPhoneNumber(phoneNumber);
    return user;
  }

  @Public()
  @Get('getUserById/:id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID của người dùng',
  })
  async getUserById(@Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return await this.identityUserService.getUserById(id);

  }

  @Public()
  @Get('checkPhoneExists/:phoneNumber')
  @ApiParam({
    name: 'phoneNumber',
    type: String,
    description: 'Số điện thoại cần kiểm tra',
  })
  async checkPhoneExists(@Param('phoneNumber') phoneNumber: string) {
    const exists =
      await this.identityUserService.isPhoneNumberExist(phoneNumber);
    return { exists };
  }

  @Public()
  @Put('updateUser/:sodienthoai')
  async updateUser(@Param('sodienthoai') sodienthoai: string, @Body() updateUserDto: UpdateIdentityUserDto) {
    const user = await this.identityUserService.updateUser(updateUserDto, sodienthoai);
    return user;
  }

  @Get('getUserInfo')
  getUserInfo(@Req() req: Request) {
    const user = req['user'];
    return {
      userId: user?.sub,
    };


  }
  @Get('all')
  async getAllUsers() {
    return this.identityUserService.getAllUsers();
  }

  @Put('change-password/:sodienthoai')
  async changePassword(
    @Param('sodienthoai') sodienthoai: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string
  ) {
    return this.identityUserService.changePassword(sodienthoai, oldPassword, newPassword);
  }

}
