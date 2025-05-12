import { DataTypes } from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { DanhMuc } from "../DanhMuc/category.entity";

@Table({ tableName: "sanpham", timestamps: false })
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
  thuockedon: string;

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
  mathuonghieu: string;

  @Column
  @ForeignKey(() => DanhMuc)
  madanhmuc: string;

  @Column
  machuongtrinh: string;

  @BelongsTo(() => DanhMuc)
  danhmuc: DanhMuc;
}