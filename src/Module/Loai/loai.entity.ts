import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ tableName: 'loai', timestamps: false })
export class Loai extends Model {
  @PrimaryKey
  @Column
  maloai: string;
  @Column
  tenloai: string;
}
