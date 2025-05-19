import { ApiProperty } from "@nestjs/swagger";
import {  IsString } from "class-validator";

export class IngredientDetailsDto{
    @ApiProperty()
    @IsString()
    hamluong: number;
}