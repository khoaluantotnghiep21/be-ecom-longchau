import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({tableName: 'chuongtrinhkhuyenmai', timestamps: false})
export class Promotion extends Model{
    @PrimaryKey
    @Column
    machuongtrinh: string;

    @Column
    tenchuongtrinh: string;

    @Column
    giatrikhuyenmai: number;

    @Column
    donviapdung: string;

    @Column
    ngaybatdau: Date;

    @Column
    ngayketthuc: Date;
}