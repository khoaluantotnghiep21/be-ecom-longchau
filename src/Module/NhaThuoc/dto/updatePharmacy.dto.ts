import { ApiProperty } from "@nestjs/swagger";

export class UpdatePharmacyDto {
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