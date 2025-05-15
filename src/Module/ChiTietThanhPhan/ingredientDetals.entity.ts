import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({tableName: 'chitietthanhphan', timestamps: false})
export class IngredientDetals extends Model{
    @PrimaryKey
    @Column
    masanpham: string

    @PrimaryKey
    @Column
    mathanhphan: string;

    @Column
    hamluong: number;
}