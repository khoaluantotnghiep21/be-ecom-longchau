import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiProperty({ required: false })
    hoten?: string;

    @ApiProperty({ required: false })
    email?: string;

    @ApiProperty({ required: false })
    gioitinh?: string;

    @ApiProperty({ required: false, type: String, format: 'date' })
    ngaysinh?: Date;

    @ApiProperty({ required: false })
    diachi?: string;

    @ApiProperty({ required: false, type: [String] }) roleids?: string[];

    @ApiProperty({ required: false })
    sodiem?: number;

    @ApiProperty({ required: false })
    sodienthoai?: string;

}