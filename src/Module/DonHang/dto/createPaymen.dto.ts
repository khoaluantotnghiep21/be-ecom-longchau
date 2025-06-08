import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";

export class CreatePaymentDto{
    @ApiProperty()
    amount: number;
    @ApiProperty()
    madonhang: string;
    
    @IsNotEmpty()
    @IsEnum(['web', 'mobile'], { message: 'Platform must be either web or mobile' })
    platform: 'web' | 'mobile'; // thêm dòng này
}