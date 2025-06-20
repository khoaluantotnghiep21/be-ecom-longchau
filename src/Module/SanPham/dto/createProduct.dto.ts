import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  tensanpham: string;
  @ApiProperty()
  dangbaoche: string;
  @ApiProperty()
  congdung: string;
  @ApiProperty()
  chidinh: string;
  @ApiProperty()
  chongchidinh: string;
  @ApiProperty()
  thuockedon: boolean;
  @ApiProperty()
  motangan: string;
  @ApiProperty()
  doituongsudung: string;
  @ApiProperty()
  luuy: string;
  @ApiProperty()
  ngaysanxuat: Date;
  @ApiProperty()
  hansudung: number;
  @ApiProperty()
  gianhap: number;
  @ApiProperty()
  mathuonghieu: string;
  @ApiProperty()
  madanhmuc: string;

}
