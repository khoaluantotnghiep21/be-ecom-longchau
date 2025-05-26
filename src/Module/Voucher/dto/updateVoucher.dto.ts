import { ApiProperty } from "@nestjs/swagger";

export class UpdateVoucherDto {
    @ApiProperty()
    loaivoucher: boolean;

    @ApiProperty()
    giatri: number;

    @ApiProperty()
    mota: string;
    
    @ApiProperty()
    hansudung: Date;
}