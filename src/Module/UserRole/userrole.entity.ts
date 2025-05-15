import { UUID } from "crypto";
import { DataTypes } from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { IdentityUser } from "../IdentityUser/identityuser.entity";
import { Role } from "../Role/role.entity";

@Table({ tableName: "userrole", timestamps: false })
export class UserRole extends Model{
    @PrimaryKey
    @ForeignKey(()=> IdentityUser)
    @Column({ type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 })
    userid: UUID;

    @PrimaryKey
    @ForeignKey(() => Role)
    @Column({ type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 })
    roleid: UUID;

    @BelongsTo(() => IdentityUser)
    user: IdentityUser;

    @BelongsTo(() => Role)
    role: Role;
}