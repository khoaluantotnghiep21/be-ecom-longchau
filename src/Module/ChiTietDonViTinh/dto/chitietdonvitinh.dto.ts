import { ApiProperty } from "@nestjs/swagger";

export class UnitDetalsDto{
    @ApiProperty()
    masanpham: string;
    
    @ApiProperty()
    madonvitinh: string;

    @ApiProperty()
    dinhluong: number

    @ApiProperty()
    giaban: number
}