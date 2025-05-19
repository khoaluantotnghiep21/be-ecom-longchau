import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Ingredient } from "../ThanhPhan/ingredient.entity";

@Table({tableName: 'chitietthanhphan', timestamps: false})
export class IngredientDetals extends Model{
    @PrimaryKey
    @Column
    masanpham: string

    @PrimaryKey
    @ForeignKey(()=> Ingredient)
    @Column
    mathanhphan: string;

    @Column
    hamluong: number;

    @BelongsTo(() => Ingredient)
    thanhphan: Ingredient;
}