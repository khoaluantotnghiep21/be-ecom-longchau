import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
        @ApiProperty({ required: false })
        hoten: string;

        @ApiProperty({ required: false })
        sodienthoai: string;

        @ApiProperty({ required: false })
        matkhau: string;

        @ApiProperty({ required: false })
        email?: string;

        @ApiProperty({ required: false })
        gioitinh?: string;

        @ApiProperty({ required: false, type: String, format: 'date' })
        ngaysinh?: Date;

        @ApiProperty({ required: false, type: Number })
        sodiem?: number;

        @ApiProperty({ required: false })
        diachi?: string;
}