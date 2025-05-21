import { ApiProperty } from "@nestjs/swagger";

export class UpdateBrandDto {
    @ApiProperty()
    tenthuonghieu: string;
    
    @ApiProperty()
    mota: string;

  }