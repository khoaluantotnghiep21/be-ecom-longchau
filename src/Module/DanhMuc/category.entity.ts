import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Loai } from '../Loai/loai.entity';

@Table({ tableName: 'danhmuc', timestamps: false })
export class DanhMuc extends Model {
  @PrimaryKey
  @Column
  madanhmuc: string;
  @Column
  tendanhmuc: string;
  @Column
  slug: string;
  @Column
  soluong: number;
  @Column
  @ForeignKey(() => Loai)
  maloai: string;
  @BelongsTo(() => Loai)
  loai: Loai;
}
