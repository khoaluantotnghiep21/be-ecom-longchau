import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ tableName: 'chitietdonhang', timestamps: false })
export class OrderDetail extends Model {
  @PrimaryKey
  @Column
  madonhang: string;

  @PrimaryKey
  @Column
  masanpham: string;

  @Column
  soluong: number;

  @Column
  giaban: number;

  @Column
  donvitinh: string;
}
