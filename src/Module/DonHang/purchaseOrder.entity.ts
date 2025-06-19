import { Column, Model, PrimaryKey, Table, DataType, ForeignKey, CreatedAt } from 'sequelize-typescript';
import { Voucher } from '../Voucher/voucher.entity';
import { Timestamp } from 'rxjs';


@Table({ tableName: 'donhang', timestamps: false })
export class PurchaseOrder extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  madonhang: string;

  @Column
  ngaymuahang: Date;

  @Column
  tongtien: number;

  @Column
  giamgiatructiep: number;

  @Column
  phivanchuyen: number;

  @Column
  thanhtien: number;

  @Column
  phuongthucthanhtoan: string;

  @ForeignKey(() => Voucher)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mavoucher: string;

  @Column
  machinhanh: string;

  @Column({ type: DataType.UUID })
  userid: string;

  @Column
  hinhthucnhanhang: string;

  @Column
  trangthai: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdat: Date;
}