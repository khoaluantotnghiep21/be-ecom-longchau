import { ApiProperty } from "@nestjs/swagger";

export class CreatePharmacyDto {
    @ApiProperty()
    thanhpho: string;
    @ApiProperty()
    quan: string;
    @ApiProperty()
    phuong: string;
    @ApiProperty()
    tenduong: string;
    @ApiProperty()
    diachicuthe: string;
        
}