import { ApiProperty } from "@nestjs/swagger";

export class PromotionDto{

    @ApiProperty()
    tenchuongtrinh: string;

    @ApiProperty()
    giatrikhuyenmai: number;

    @ApiProperty()
    donviapdung: string;

    @ApiProperty()
    ngaybatdau: Date;

    @ApiProperty()
    ngayketthuc: Date;
}