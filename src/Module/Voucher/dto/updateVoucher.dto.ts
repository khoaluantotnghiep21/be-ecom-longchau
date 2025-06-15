import { ApiProperty } from "@nestjs/swagger";

export class UpdateVoucherDto {
    @ApiProperty()
    mavoucher: boolean;

    @ApiProperty()
    loaivoucher: boolean;

    @ApiProperty()
    soluong: number;

    @ApiProperty()
    mota: string;

    @ApiProperty()
    hansudung: Date;

    @ApiProperty()
    giatri: number;
}