import { UUID } from "crypto";
import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "userrole", timestamps: false })
export class UserRole extends Model{
    @PrimaryKey
    @Column
    userid: UUID;

    @PrimaryKey
    @Column
    roleid: UUID;
}