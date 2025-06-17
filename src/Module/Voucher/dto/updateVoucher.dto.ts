import { ApiProperty } from "@nestjs/swagger";

export class UpdateVoucherDto {
    @ApiProperty()
    mavoucher: string;

    @ApiProperty()
    soluong: number;

    @ApiProperty()
    mota: string;

    @ApiProperty()
    hansudung: Date;

    @ApiProperty()
    giatri: number;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;
}