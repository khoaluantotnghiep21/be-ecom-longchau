
import { UUID } from "crypto";
import { DataTypes } from "sequelize";
import { Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Pharmacy } from "../NhaThuoc/pharmacy.entity";
import { IdentityUser } from "../IdentityUser/identityuser.entity";

@Table({tableName: 'nhathuoc_nhanvien', timestamps: false})
export class PharmacyEmployes extends Model{
    @PrimaryKey
    @ForeignKey(() => Pharmacy)
    @Column({ type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 })
    idnhathuoc: UUID;

    @PrimaryKey
    @ForeignKey(() => IdentityUser)
    @Column({ type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 })
    idnhanvien: UUID;
}