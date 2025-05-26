import { Column, Model, PrimaryKey, Table, DataType } from 'sequelize-typescript';


@Table({ tableName: 'donhang', timestamps: false })
export class PurchaseOrder extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @Column
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

  @Column
  mavoucher: string;

  @Column
  machinhanh: string;

  @Column({ type: DataType.UUID })
  userid: string;

  @Column
  hinhthucnhanhang: string;

  @Column
  trangthai: string;
}