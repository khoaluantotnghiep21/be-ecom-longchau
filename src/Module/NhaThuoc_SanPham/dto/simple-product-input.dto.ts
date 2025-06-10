import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SimpleProductInputDto {
  @ApiProperty({
    description: 'Mã chi nhánh nhà thuốc',
    example: 'CN001'
  })
  @IsNotEmpty({ message: 'Mã chi nhánh không được để trống' })
  @IsString()
  machinhanh: string;

  @ApiProperty({
    description: 'Danh sách mã sản phẩm',
    example: ['SP001', 'SP002', 'SP003'],
    type: [String]
  })
  @IsNotEmpty({ message: 'Mã sản phẩm không được để trống' })
  @IsArray()
  masanpham: string[];

  @ApiProperty({
    description: 'Danh sách số lượng tương ứng với từng mã sản phẩm',
    example: [10, 20, 30],
    type: [Number]
  })
  @IsNotEmpty({ message: 'Số lượng không được để trống' })
  @IsArray()
  soluong: number[];
}
