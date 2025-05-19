import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class UpdateIngredientDetailsDto{
    @ApiProperty()
    @IsNotEmpty()
    madonvitinh: string;

    @ApiProperty()
    @IsInt()
    hamluong: number;

}