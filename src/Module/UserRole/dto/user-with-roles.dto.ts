import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class UserWithRolesDto {
    @ApiProperty({
        description: 'ID của người dùng',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsNotEmpty({ message: 'ID người dùng không được để trống' })
    @IsUUID('4', { message: 'ID người dùng phải là UUID hợp lệ' })
    userid: UUID;

    @ApiProperty({
        description: 'Danh sách ID các vai trò cần gán cho người dùng',
        type: [String],
        example: ['123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174002']
    })
    @IsArray({ message: 'Danh sách vai trò phải là một mảng' })
    @ArrayNotEmpty({ message: 'Danh sách vai trò không được để trống' })
    @IsUUID('4', { each: true, message: 'Mỗi ID vai trò phải là UUID hợp lệ' })
    roleids: UUID[];
}
