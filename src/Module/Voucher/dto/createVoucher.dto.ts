import { ApiProperty } from "@nestjs/swagger";

export class CreateVoucherDto {
    @ApiProperty()
    loaivoucher: boolean;

    @ApiProperty()
    giatri: number;

    @ApiProperty()
    mota: string;

    @ApiProperty()
    hansudung: Date;
}