import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class DeliveryDto {
  @ApiProperty({
    description: 'Tên người đặt hàng',
    example: 'Nguyễn Văn A'
  })
  @IsNotEmpty({ message: 'Tên người đặt không được để trống' })
  @IsString()
  nguoidat: string;

  @ApiProperty({
    description: 'Tên người nhận hàng',
    example: 'Nguyễn Văn B'
  })
  @IsNotEmpty({ message: 'Tên người nhận không được để trống' })
  @IsString()
  nguoinhan: string;

  @ApiProperty({
    description: 'Mã đơn hàng',
    example: 'DH12345'
  })
  @IsNotEmpty({ message: 'Mã đơn hàng không được để trống' })
  @IsString()
  madonhang: string;

  @ApiProperty({
    description: 'Thời gian nhận hàng',
    example: '2025-06-15T15:30:00.000Z',
    required: false
  })
  @IsOptional()
  thoigiannhan?: Date;

  @ApiProperty({
    description: 'Trạng thái giao hàng',
    example: 'Đang giao',
    required: false
  })
  @IsOptional()
  @IsString()
  trangthai?: string;
}

export class UpdateDeliveryDto {
  @ApiProperty({
    description: 'Tên người đặt hàng',
    example: 'Nguyễn Văn A',
    required: false
  })
  @IsOptional()
  @IsString()
  nguoidat?: string;

  @ApiProperty({
    description: 'Tên người nhận hàng',
    example: 'Nguyễn Văn B',
    required: false
  })
  @IsOptional()
  @IsString()
  nguoinhan?: string;

  @ApiProperty({
    description: 'Thời gian nhận hàng',
    example: '2025-06-15T15:30:00.000Z',
    required: false
  })
  @IsOptional()
  thoigiannhan?: Date;

  @ApiProperty({
    description: 'Trạng thái giao hàng',
    example: 'Đã giao',
    required: false
  })
  @IsOptional()
  @IsString()
  trangthai?: string;
}
