import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentDto{
    @ApiProperty()
    amount: number;
    @ApiProperty()
    madonhang: string;
}