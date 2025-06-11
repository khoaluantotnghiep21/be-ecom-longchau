import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UserInfo } from "../UserInfo/userinfo.entity";
import { Role } from "../Role/role.entity";

@Table({ tableName: "userrole", timestamps: false })
export class UserRole extends Model {
    @PrimaryKey
    @ForeignKey(() => UserInfo)
    @Column({ type: DataType.UUID })
    userid: string;

    @PrimaryKey
    @ForeignKey(() => Role)
    @Column({ type: DataType.UUID })
    roleid: string;

    @BelongsTo(() => UserInfo, 'userid')
    user: UserInfo;

    @BelongsTo(() => Role, 'roleid')
    role: Role;
}