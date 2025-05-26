import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { DeliveryMethod } from "src/common/Enum/delivery-method.enum";
import { PaymentMethod } from "src/common/Enum/payment-method.enum";

export class CreateNewOrderDto {
    @ApiProperty()
    hinhthucnhanhang: DeliveryMethod;

    @ApiProperty()
    userid: UUID;

    @ApiProperty()
    mavoucher?: string;

    @ApiProperty()
    machinhanh?: string;

    @ApiProperty()
    phuongthucthanhtoan: PaymentMethod;

    
}