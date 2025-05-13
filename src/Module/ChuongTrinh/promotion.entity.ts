import { ApiProperty } from "@nestjs/swagger";
import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({tableName: 'chuongtrinhkhuyenmai', timestamps: false})
export class ChuongTrinhKhuyenMai extends Model{
    @PrimaryKey
    @ApiProperty()
    @Column
    machuongtrinh: string;

    @ApiProperty()
    @Column
    tenchuongtrinh: string;

    @ApiProperty()
    @Column
    giatrikhuyenmai: number;

    @ApiProperty()
    @Column
    donviapdung: string;

    @ApiProperty()
    @Column
    ngaybatdau: Date;

    @ApiProperty()
    @Column
    ngayketthuc: Date;
}