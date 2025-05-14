import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({tableName: 'chitietdonvi', timestamps: false})
export class UnitDetals extends Model{
    @PrimaryKey
    @Column
    
    masanpham: string;

    @PrimaryKey
    @Column
    madonvitinh: string;
    
    @Column
    giaban: number;

    @Column
    dinhluong: number;
}