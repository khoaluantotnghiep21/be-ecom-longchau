import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDeliveryDto {
  @ApiProperty({
    description: 'Tên người nhận hàng',
    example: 'Nguyễn Văn A'
  })
  @IsNotEmpty({ message: 'Tên người nhận không được để trống' })
  @IsString()
  nguoinhan: string;

  @ApiProperty({
    description: 'Số điện thoại người nhận',
    example: '0912345678'
  })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString()
  sodienthoainguoinhan: string;

  @ApiProperty({
    description: 'Địa chỉ người nhận',
    example: '123 Đường ABC, Quận 1, TP.HCM'
  })
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  @IsString()
  diachinguoinhan: string;

  @ApiProperty({
    description: 'Mã đơn hàng',
    example: 'DH12345'
  })
  @IsNotEmpty({ message: 'Mã đơn hàng không được để trống' })
  @IsString()
  madonhang: string;
}

export class DeliveryDto extends CreateDeliveryDto {
  @ApiProperty({
    description: 'Thời gian dự kiến giao hàng',
    example: '2025-06-15T15:30:00.000Z',
    required: false
  })
  @IsOptional()
  thoigiandukien?: Date;

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
    description: 'Tên người nhận hàng',
    example: 'Nguyễn Văn B',
    required: false
  })
  @IsOptional()
  @IsString()
  nguoinhan?: string;

  @ApiProperty({
    description: 'Số điện thoại người nhận',
    example: '0912345678',
    required: false
  })
  @IsOptional()
  @IsString()
  sodienthoainguoinhan?: string;

  @ApiProperty({
    description: 'Địa chỉ người nhận',
    example: '123 Đường ABC, Quận 1, TP.HCM',
    required: false
  })
  @IsOptional()
  @IsString()
  diachinguoinhan?: string;

  @ApiProperty({
    description: 'Thời gian dự kiến giao hàng',
    example: '2025-06-15T15:30:00.000Z',
    required: false
  })
  @IsOptional()
  thoigiandukien?: Date;

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

export class ConfirmDeliveryDto {
  @ApiProperty({
    description: 'ID đơn giao hàng',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty({ message: 'ID đơn giao hàng không được để trống' })
  @IsUUID('4')
  id: string;
}

export class GetDeliveryDetailsDto {
  @ApiProperty({
    description: 'ID đơn giao hàng',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty({ message: 'ID đơn giao hàng không được để trống' })
  @IsUUID('4')
  id: string;
}
