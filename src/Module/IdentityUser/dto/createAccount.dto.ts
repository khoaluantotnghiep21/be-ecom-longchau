import { ApiProperty } from "@nestjs/swagger";

export class CreateAccountDto {
    @ApiProperty()
    sodienthoai: string;
    @ApiProperty()
    matkhau: string;
}