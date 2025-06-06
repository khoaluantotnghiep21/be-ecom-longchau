import { Body, Controller, Param, Post, Put } from "@nestjs/common";
import { IngredientDetalsService } from "./ingredientDetals.service";
import { Public } from "src/common/decorator/public.decorator";
import { IngredientDetailsDto } from "./dto/ingredientDetalsDto.dto";
import { UpdateIngredientDetailsDto } from "./dto/updateingredientDetailsDto.dto";

@Controller('IngredientDetails')
export class IngredientDetailsController{
    constructor(
        private readonly ingredientDetalsService: IngredientDetalsService
    ){}

    @Public()
    @Post('addIngredientDetailsForProduct/:masanpham/:mathanhphan')
    async addIngredientDetailsForProduct(@Param('masanpham') masanpham: string, @Param('mathanhphan') mathanhphan: string, @Body() ingredientDetailsDto: IngredientDetailsDto): Promise<boolean>{
        await this.ingredientDetalsService.addIngredientDetalsForProduct(masanpham, mathanhphan, ingredientDetailsDto)
        return true;
    }

    @Public()
    @Put('updateIngredientDetailsForProduct/:masanpham/:mathanhphan')
    async updateIngredientDetailsForProduct(@Param('masanpham') masanpham: string, @Param('mathanhphan') mathanhphan: string, @Body() updateIngredientDetailsDto: UpdateIngredientDetailsDto): Promise<boolean>{
        await this.ingredientDetalsService.updateIngredientDetailsForProduct(masanpham, mathanhphan, updateIngredientDetailsDto)
        return true;
    }
}