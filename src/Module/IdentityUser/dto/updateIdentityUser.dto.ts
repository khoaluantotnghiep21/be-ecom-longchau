import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail } from "class-validator";

export class UpdateIdentityUserDto {
    @ApiProperty()
    hoten?: string;
    
    @IsEmail()
    @ApiProperty()
    email?: string;

    @IsDate()
    @ApiProperty()
    ngaysinh?: Date;

    @ApiProperty()
    gioitinh?: string;
}