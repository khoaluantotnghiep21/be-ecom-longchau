import { Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { PurchaseOrder } from '../DonHang/purchaseOrder.entity';

@Table({ tableName: 'giaohang', timestamps: false })
export class GiaoHang extends Model {
  @PrimaryKey
  @Column({ type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 })
  declare id: string;

  @Column({ allowNull: false })
  nguoinhan: string;

  @Column
  sodienthoainguoinhan: string;

  @Column
  diachinguoinhan: string;

  @ForeignKey(() => PurchaseOrder)
  @Column({ allowNull: false })
  madonhang: string;

  @Column({ type: DataTypes.DATE })
  thoigiandukien: Date;

  @Column({ type: DataTypes.DATE })
  thoigiannhan: Date;

  @Column({ type: DataTypes.STRING(50) })
  trangthai: string;
}
