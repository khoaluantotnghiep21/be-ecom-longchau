import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

export class ProductIdsDto {
    @ApiProperty({ 
        description: 'Danh sách ID của các sản phẩm cần áp dụng chương trình khuyến mãi',
        type: [String],
        example: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001']
    })
    @IsArray()
    @ArrayNotEmpty({ message: 'Danh sách ID sản phẩm không được để trống' })
    @IsUUID('4', { each: true, message: 'Mỗi ID sản phẩm phải là UUID hợp lệ' })
    productIds: string[];
}
