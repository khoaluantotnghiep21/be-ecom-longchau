import { UUID } from "crypto";
import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UserRole } from "../UserRole/userrole.entity";

@Table({ tableName: "role", timestamps: false })
export class Role extends Model{
    @PrimaryKey
    @Column({ type: "uuid", defaultValue: () => "uuid_generate_v4()" })
    declare id: UUID;

    @Column
    namerole: string;

    @HasMany(() => UserRole)
    userroles: UserRole[];
}