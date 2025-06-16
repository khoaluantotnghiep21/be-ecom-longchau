import { Column, Model, PrimaryKey, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'donthuoctuvan', timestamps: false })
export class DonThuocTuVan extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @Column
  madonhang: string;

  @Column
  hoten: string;

  @Column
  sodienthoai: string;

  @Column
  ghichu: string;
}
