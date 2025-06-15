import { ApiProperty } from "@nestjs/swagger";

export class CreateVoucherDto {
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
}