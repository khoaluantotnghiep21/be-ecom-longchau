import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({tableName: 'voucher', timestamps: false})
export class Voucher extends Model{
    @PrimaryKey
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