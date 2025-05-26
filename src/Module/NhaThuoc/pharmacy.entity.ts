import { DataTypes } from 'sequelize';
import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ tableName: 'nhathuoc', timestamps: false })
export class Pharmacy extends Model {
  @PrimaryKey
    @Column({ type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 })
    declare id: string;

    @Column
    machinhanh: string;

    @Column
    thanhpho: string;

    @Column
    quan: string;

    @Column
    phuong: string;

    @Column
    tenduong: string;

    @Column
    diachicuthe: string;
}
