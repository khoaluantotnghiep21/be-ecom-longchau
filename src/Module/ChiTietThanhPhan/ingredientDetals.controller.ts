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
    @Post('addIngredientDetalsForProduct/:masanpham/:madonvitinh')
    async addIngredientDetalsForProduct(@Param('masanpham') masanpham: string, @Param('madonvitinh') madonvitinh: string, @Body() ingredientDetailsDto: IngredientDetailsDto): Promise<boolean>{
        await this.ingredientDetalsService.addIngredientDetalsForProduct(masanpham, madonvitinh, ingredientDetailsDto)
        return true;
    }

    @Public()
    @Put('updateIngredientDetalsForProduct/:masanpham/:madonvitinh')
    async updateIngredientDetalsForProduct(@Param('masanpham') masanpham: string, @Param('madonvitinh') madonvitinh: string, @Body() updateIngredientDetailsDto: UpdateIngredientDetailsDto): Promise<boolean>{
        await this.ingredientDetalsService.updateIngredientDetalsForProduct(masanpham, madonvitinh, updateIngredientDetailsDto)
        return true;
    }

}