import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class IngredientDetailsDto{
    @ApiProperty()
    @IsInt()
    dinhluong: number;

    @ApiProperty()
    @IsInt()
    giaban: number;


}