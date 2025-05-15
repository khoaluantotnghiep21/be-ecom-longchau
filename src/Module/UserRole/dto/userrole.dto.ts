import { ApiProperty } from "@nestjs/swagger"
import { UUID } from "crypto"

export class UserRoleDto{
    @ApiProperty()
    userid: UUID
    @ApiProperty()
    roleid: UUID
}