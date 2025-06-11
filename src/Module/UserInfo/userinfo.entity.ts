import { Table, Column, Model, PrimaryKey, DataType, HasMany } from 'sequelize-typescript';
import { UserRole } from '../UserRole/userrole.entity';

@Table({ tableName: 'identityuser', timestamps: false })
export class UserInfo extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
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

  @HasMany(() => UserRole)
  userroles: UserRole[];
}