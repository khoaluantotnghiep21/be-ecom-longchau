import { Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { SanPham } from '../SanPham/product.entity';
import { IdentityUser } from '../IdentityUser/identityuser.entity';
import { Pharmacy } from '../NhaThuoc/pharmacy.entity';
import { UUID } from 'crypto';

@Table({ tableName: 'nhathuoc_sanpham', timestamps: false })
export class NhaThuoc_SanPham extends Model {
  @PrimaryKey
  @Column({ type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 })
  declare id: UUID;

  @ForeignKey(() => Pharmacy)
  @Column({ allowNull: false })
  machinhanh: string;

  @ForeignKey(() => SanPham)
  @Column({ allowNull: false })
  masanpham: string;

  @Column({ allowNull: false })
  soluong: number;

  @Column({ type: DataTypes.UUID, allowNull: false })
  userid: string;

  @Column({ type: DataTypes.DATE })
  ngaygui: Date;

  @Column
  tinhtrang: string;
}
