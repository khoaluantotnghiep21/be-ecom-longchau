import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class PharmacyEmployeeDto {
  @ApiProperty({
    description: 'ID của nhà thuốc',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty({ message: 'ID nhà thuốc không được để trống' })
  @IsUUID(4, { message: 'ID nhà thuốc phải là UUID' })
  idnhathuoc: string;

  @ApiProperty({
    description: 'ID của nhân viên',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsNotEmpty({ message: 'ID nhân viên không được để trống' })
  @IsUUID(4, { message: 'ID nhân viên phải là UUID' })
  idnhanvien: string;
}

export class RemoveEmployeeDto {
  @ApiProperty({
    description: 'ID của nhà thuốc',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty({ message: 'ID nhà thuốc không được để trống' })
  @IsUUID(4, { message: 'ID nhà thuốc phải là UUID' })
  idnhathuoc: string;

  @ApiProperty({
    description: 'ID của nhân viên',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsNotEmpty({ message: 'ID nhân viên không được để trống' })
  @IsUUID(4, { message: 'ID nhân viên phải là UUID' })
  idnhanvien: string;
}

export class GetPharmacyEmployeesDto {
  @ApiProperty({
    description: 'ID của nhà thuốc',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty({ message: 'ID nhà thuốc không được để trống' })
  @IsUUID(4, { message: 'ID nhà thuốc phải là UUID' })
  idnhathuoc: string;
}
