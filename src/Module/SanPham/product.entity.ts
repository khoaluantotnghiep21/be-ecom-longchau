import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { DanhMuc } from '../DanhMuc/category.entity';
import { ThuongHieu } from '../ThuongHieu/thuonghieu.entity';
import { Promotion } from '../ChuongTrinh/promotion.entity';
import { Media } from '../Media/media.entity';

@Table({ tableName: 'sanpham', timestamps: false })
export class SanPham extends Model<SanPham> {
  @PrimaryKey
  @Column({ type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 })
  declare id: string;

  @Column({ type: DataTypes.STRING })
  masanpham: string;

  @Column
  tensanpham: string;

  @Column
  slug: string;

  @Column
  dangbaoche: string;

  @Column
  congdung: string;

  @Column
  chidinh: string;

  @Column
  chongchidinh: string;

  @Column
  thuockedon: boolean;

  @Column
  motangan: string;

  @Column
  doituongsudung: string;

  @Column
  luuy: string;

  @Column
  ngaysanxuat: Date;

  @Column
  hansudung: number;

  @Column
  gianhap: number;

  @Column
  @ForeignKey(() => ThuongHieu)
  mathuonghieu: string;

  @Column
  @ForeignKey(() => DanhMuc)
  madanhmuc: string;

  @Column
  @ForeignKey(() => Promotion)
  machuongtrinh: string;

  @BelongsTo(() => DanhMuc)
  danhmuc: DanhMuc;

  @BelongsTo(() => ThuongHieu)
  thuonghieu: ThuongHieu;

  @BelongsTo(() => Promotion)
  khuyenmai: Promotion;

  @HasMany(() => Media)
  anhsanpham: Media[];
}
