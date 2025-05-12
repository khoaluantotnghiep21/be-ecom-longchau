import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "danhmuc", timestamps: false })
export class DanhMuc extends Model{
    @PrimaryKey
    @Column
    madanhmuc: string;
    @Column
    tendanhmuc: string;
    @Column
    soluong: number;
}