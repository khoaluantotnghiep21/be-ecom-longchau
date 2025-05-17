import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SignInDto {
  @ApiProperty()
  @IsPhoneNumber()
  @IsNotEmpty()
  sodienthoai: string;
  @IsNotEmpty()
  @ApiProperty()
  matkhau: string;
}
