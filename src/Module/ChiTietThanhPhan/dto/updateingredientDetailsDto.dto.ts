import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class UpdateIngredientDetailsDto{
    @ApiProperty()
    @IsNotEmpty()
    mathanhphan: string;

    @ApiProperty()
    @IsInt()
    hamluong: number;

}