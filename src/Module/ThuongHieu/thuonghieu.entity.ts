import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({tableName: "thuonghieu", timestamps: false })
export class ThuongHieu extends Model{
    @PrimaryKey
    @Column
    mathuonghieu: string;

    @Column
    tenthuonghieu: string;

    @Column
    mota: string;
}