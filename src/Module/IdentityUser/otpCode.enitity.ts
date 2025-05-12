import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "otpcode", timestamps: false })
export class OtpCode extends Model{
    @PrimaryKey
    @Column({ type: "uuid", defaultValue: () => "uuid_generate_v4()" })
    declare id: string;

    @Column
    sodienthoai: string;
    
    @Column
    otpcode: string;

    @Column
    declare createdAt: Date;
}