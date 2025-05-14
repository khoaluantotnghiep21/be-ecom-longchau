import { ApiProperty } from "@nestjs/swagger";

export class UpdateUnitDetalsDto{
    @ApiProperty()
    madonvitinh: string;

    @ApiProperty()
    giaban: number;

    @ApiProperty()
    dinhluong: string;
}