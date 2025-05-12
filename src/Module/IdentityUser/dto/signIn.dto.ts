import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
    @ApiProperty()
    sodienthoai: string;
    @ApiProperty()
    matkhau: string;
}