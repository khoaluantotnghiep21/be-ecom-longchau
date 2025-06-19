import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'voucher',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Voucher extends Model<Voucher> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    mavoucher: string;

    @Column
    soluong: number;

    @Column
    mota: string;

    @Column
    hansudung: Date;

    @Column
    giatri: number;

    @Column
    created_at: Date;

    @Column
    updated_at: Date;
}