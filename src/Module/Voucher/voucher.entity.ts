import { DataTypes } from "sequelize";
import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({tableName: 'voucher', timestamps: false})
export class Voucher extends Model{
    @PrimaryKey
    @Column({ type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 })
    declare id: string;
    
    @Column
    mavoucher: string;

    @Column
    loaivoucher: boolean;

    @Column
    giatri: number;

    @Column
    mota: string;

    @Column
    hansudung: Date;
}