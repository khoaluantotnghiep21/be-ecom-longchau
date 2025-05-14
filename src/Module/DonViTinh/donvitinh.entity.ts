import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({tableName: 'donvitinh', timestamps: false})
export class Unit extends Model{
    @PrimaryKey
    @Column
    madonvitinh: string;

    @Column
    donvitinh: string;
}