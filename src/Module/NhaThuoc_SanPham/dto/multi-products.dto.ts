import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Transform } from 'class-transformer';
// DTO cho từng cặp sản phẩm và số lượng
export class ProductQuantityDto {
  @ApiProperty({
    description: 'Mã sản phẩm',
    example: 'SP001'
  })
  @IsNotEmpty({ message: 'Mã sản phẩm không được để trống' })
  @IsString()
  masanpham: string;

 @ApiProperty({
    description: 'Số lượng sản phẩm',
    example: 100
  })
  @IsNotEmpty({ message: 'Số lượng không được để trống' })
  @Transform(({ value }) => Number(value)) // <-- Ép sang number
  @IsNumber({}, { message: 'Số lượng phải là số' })
  soluong: number;
}

// DTO cho danh sách sản phẩm
export class MultiProductsDto {
  @ApiProperty({
    description: 'Mã chi nhánh nhà thuốc',
    example: 'CN001'
  })
  @IsNotEmpty({ message: 'Mã chi nhánh không được để trống' })
  @IsString()
  machinhanh: string;

  @ApiProperty({
    description: 'Danh sách sản phẩm và số lượng',
    type: [ProductQuantityDto],
    isArray: true
  })
  @IsNotEmpty({ message: 'Danh sách sản phẩm không được để trống' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductQuantityDto)
  products: ProductQuantityDto[];
}
