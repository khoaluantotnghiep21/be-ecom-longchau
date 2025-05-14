import { DataTypes } from 'sequelize';
import {
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { SanPham } from '../SanPham/product.entity';

@Table({ tableName: 'anhsanpham', timestamps: false })
export class Media extends Model {
  @PrimaryKey
  @Column({ type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 })
  declare id: string;

  @ForeignKey(() => SanPham)
  @Column({ type: DataTypes.UUID })
  idsanpham: string;

  @BelongsTo(() => SanPham)
  sanpham: SanPham;

  @Column
  url: string;

  @Column
  type: string;

  @Column
  size: number;
}
