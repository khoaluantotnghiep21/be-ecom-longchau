import { DataTypes } from 'sequelize';
import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ tableName: 'identityuser', timestamps: false })
export class IdentityUser extends Model {
  @PrimaryKey
  @Column({ type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 })
  declare id: string;

  @Column
  hoten: string;

  @Column
  sodienthoai: string;

  @Column
  matkhau: string;

  @Column
  email: string;

  @Column
  gioitinh: string;

  @Column
  ngaysinh: Date;

  @Column
  sodiem: number;

  @Column
  diachi: string;
}
