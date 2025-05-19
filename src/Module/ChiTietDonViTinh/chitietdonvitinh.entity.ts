import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Unit } from "../DonViTinh/donvitinh.entity";

@Table({tableName: 'chitietdonvi', timestamps: false})
export class UnitDetals extends Model{
    @PrimaryKey
    @Column
    masanpham: string;

    @PrimaryKey
    @ForeignKey(() => Unit)
    @Column
    madonvitinh: string;
    
    @Column
    giaban: number;

    @Column
    dinhluong: number;

    @BelongsTo(() => Unit)
    donvitinh: Unit;
}