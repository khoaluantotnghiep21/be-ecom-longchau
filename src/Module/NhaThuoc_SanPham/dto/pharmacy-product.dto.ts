import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class PharmacyProductDto {
  @ApiProperty({
    description: 'Mã chi nhánh nhà thuốc',
    example: 'CN001'
  })
  @IsNotEmpty({ message: 'Mã chi nhánh không được để trống' })
  @IsString()
  machinhanh: string;

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
  @IsNumber()
  soluong: number;

  @ApiProperty({
    description: 'Mã nhập hàng (được sinh tự động)',
    example: 'NH-20250611-1234',
    required: false
  })
  @IsOptional()
  @IsString()
  manhaphang?: string;
}

export class UpdatePharmacyProductDto {
  @ApiProperty({
    description: 'Mã chi nhánh nhà thuốc',
    example: 'CN001',
    required: false
  })
  @IsOptional()
  @IsString()
  machinhanh?: string;

  @ApiProperty({
    description: 'Mã sản phẩm',
    example: 'SP001',
    required: false
  })
  @IsOptional()
  @IsString()
  masanpham?: string;

  @ApiProperty({
    description: 'Mã nhập hàng',
    example: 'NH-20250611-1234',
    required: false
  })
  @IsOptional()
  @IsString()
  manhaphang?: string;

  @ApiProperty({
    description: 'Số lượng sản phẩm',
    example: 100,
    required: false
  })
  @IsOptional()
  @IsNumber()
  soluong?: number;

  @ApiProperty({
    description: 'Tình trạng',
    example: 'Còn hàng',
    required: false
  })
  @IsOptional()
  @IsString()
  tinhtrang?: string;
}

export class StatusDto{
  @ApiProperty({
    description: 'Tình trạng sản phẩm',
    example: 'Xác nhận đơn hàng',
  })
  @IsNotEmpty({ message: 'Tình trạng không được để trống' })
  @IsString()
  tinhtrang: string;
}