import { ApiProperty } from "@nestjs/swagger";

export class CreateBrandDto {
    @ApiProperty()
    tenthuonghieu: string;

    @ApiProperty()
    mota: string;
  }