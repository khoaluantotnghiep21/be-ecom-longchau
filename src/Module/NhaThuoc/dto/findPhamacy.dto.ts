import { ApiProperty } from "@nestjs/swagger"

export class FindPhamacyDto {
    @ApiProperty()
    provinces: string
    @ApiProperty()
    district: string
}