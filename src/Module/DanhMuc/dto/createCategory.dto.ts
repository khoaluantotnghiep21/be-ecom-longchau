import { ApiProperty } from "@nestjs/swagger";


export class CreateCategoryDto {
    @ApiProperty()
    tendanhmuc: string
}