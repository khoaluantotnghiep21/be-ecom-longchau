import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PromotionService } from "./promotion.service";
import { Public } from "src/common/decorator/public.decorator";
import { PromotionDto } from "./dto/promotion.dto";
import { Promotion } from "./promotion.entity";

@ApiTags('Promotion')
@Controller('promition')
export class PromotionController {
    constructor(
        private readonly promotionService: PromotionService
    ){}

    @Public()
    @Get('getAllPromotion')
    async getAllPromotion(){
        return await this.promotionService.getAllPromotion()
    }
    
    @Public()
    @Post('createNewPromotion')
    async createNewPromotion(@Body() promotionDto: PromotionDto): Promise<Promotion>{
        return await this.promotionService.createPromotion(promotionDto)
    }

    @Public()
    @Put('updatePromotion/:machuongtrinh')
    async updatePromotion(@Param('machuongtrinh') machuongtrinh: string, @Body() promotionDto: PromotionDto): Promise<Promotion>{
        return await this.promotionService.updatePromotion(machuongtrinh, promotionDto)
    }

    @Public()
    @Delete('deletePromotion/:machuongtrinh')
    async deletePromotion(@Param('machuongtrinh') machuongtrinh: string){
        return await this.promotionService.deletePromise(machuongtrinh)
    }

}