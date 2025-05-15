import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({tableName: 'thanhphan', timestamps: false})
export class Ingredient extends Model{
    @PrimaryKey
    @Column
    mathanhphan: string;

    @Column
    tenthanhphan: string;
}