import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ tableName: 'chitietdonhang', timestamps: false })
export class OrderDetail extends Model {
  @PrimaryKey
  @Column
  madonhang: string;

  @PrimaryKey
  @Column
  masanpham: string;

  @PrimaryKey
  @Column
  donvitinh: string;

  @Column
  soluong: number;

  @Column
  giaban: number;

  
}
