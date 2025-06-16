import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDonThuocTuVanDto {
  @ApiProperty({
    description: 'Mã đơn hàng liên quan',
    example: 'DH202506160001'
  })
  @IsString()
  @IsOptional()
  madonhang: string;

  @ApiProperty({
    description: 'Họ tên người cần tư vấn',
    example: 'Nguyễn Văn A'
  })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString()
  hoten: string;

  @ApiProperty({
    description: 'Số điện thoại liên hệ',
    example: '0912345678'
  })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString()
  sodienthoai: string;

  @ApiProperty({
    description: 'Ghi chú về đơn thuốc cần tư vấn',
    example: 'Cần tư vấn về đơn thuốc trị sốt'
  })
  @IsString()
  @IsOptional()
  ghichu?: string;
}

export class UpdateDonThuocTuVanDto {

  @ApiProperty({
    description: 'Họ tên người cần tư vấn',
    example: 'Nguyễn Văn A'
  })
  @IsString()
  @IsOptional()
  hoten?: string;

  @ApiProperty({
    description: 'Số điện thoại liên hệ',
    example: '0912345678'
  })
  @IsString()
  @IsOptional()
  sodienthoai?: string;

  @ApiProperty({
    description: 'Ghi chú về đơn thuốc cần tư vấn',
    example: 'Cần tư vấn về đơn thuốc trị sốt'
  })
  @IsString()
  @IsOptional()
  ghichu?: string;
}

export class DonThuocTuVanResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  madonhang: string;

  @ApiProperty()
  hoten: string;

  @ApiProperty()
  sodienthoai: string;

  @ApiProperty()
  ghichu: string;
}
