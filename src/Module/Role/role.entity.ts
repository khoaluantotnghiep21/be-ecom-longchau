import { UUID } from "crypto";
import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "role", timestamps: false })
export class Role extends Model{
    @PrimaryKey
    @Column({ type: "uuid", defaultValue: () => "uuid_generate_v4()" })
    declare id: UUID;

    @Column
    namerole: string;
}