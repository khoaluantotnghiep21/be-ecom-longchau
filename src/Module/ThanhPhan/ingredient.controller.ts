import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { IngredientService } from "./ingredient.service";
import { Public } from "src/common/decorator/public.decorator";
import { IngredientDto } from "./dto/ingredient.dto";
import { Ingredient } from "./ingredient.entity";
import { ApiTags } from "@nestjs/swagger";
@ApiTags('Ingredient')
@Controller('Ingredient')
export class IngredientController{
    constructor(
        private readonly ingredientService: IngredientService
    ){}

    @Public()
    @Get('getAllIngredient')
    async getAllIngredient():Promise<Ingredient[]>{
        return await this.ingredientService.getAllIngredient()
    }

    @Public()
    @Post('createIngredient')
    async createIngredient(@Body() ingredientDto: IngredientDto): Promise<Ingredient>{
        return await this.ingredientService.createIngredient(ingredientDto);
    }

    @Public()
    @Put('updateIngredient/:mathanhphan')
    async  updateIngredient(@Param('mathanhphan') mathanhphan: string, @Body() ingredientDto: IngredientDto): Promise<Ingredient>{
        return await this.ingredientService.updateIngredient(mathanhphan, ingredientDto)
    }

    @Public()
    @Delete('deleteIngredient/:mathanhphan')
    async deleteIngredient(@Param('mathanhphan') mathanhphan: string): Promise<boolean>{
        return await this.ingredientService.deleteIngredient(mathanhphan)
    }
    
}