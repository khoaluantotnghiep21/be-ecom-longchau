import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PromotionService } from "./promotion.service";
import { Public } from "src/common/decorator/public.decorator";
import { PromotionDto } from "./dto/promotion.dto";
import { Promotion } from "./promotion.entity";
import { ProductIdsDto } from "./dto/product-ids.dto";
import { Roles } from "src/common/decorator/roles.decorator";
import { Role } from "src/common/Enum/role.enum";

@ApiTags('Promotion')
@Controller('promotion')
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

    @Public()
    @Post('apply/:machuongtrinh')
    @ApiOperation({ summary: 'Áp dụng chương trình khuyến mãi cho danh sách sản phẩm' })
    @ApiParam({ name: 'machuongtrinh', description: 'Mã chương trình khuyến mãi' })
    @ApiBody({ type: ProductIdsDto })
    
    async applyPromotionToProducts(
        @Param('machuongtrinh') machuongtrinh: string, 
        @Body() productIdsDto: ProductIdsDto
    ) {
        return await this.promotionService.applyPromotionToProducts(machuongtrinh, productIdsDto.productIds);
    }

    @Public()
    @Post('removeAllPromotionFromProducts')
    @ApiOperation({ summary: 'Xóa chương trình khuyến mãi khỏi danh sách sản phẩm' })
    @ApiBody({ type: ProductIdsDto })
    async removePromotionFromProducts(@Body() productIdsDto: ProductIdsDto) {
        return await this.promotionService.removePromotionFromProducts(productIdsDto.productIds);
    }

    @Public()
    @Get('findAllProductByPromotion/:machuongtrinh')
    @ApiOperation({ summary: 'Lấy thông tin tất cả sản phẩm trong chương trình' })

    async findAllProductByPromotion(@Param('machuongtrinh') machuongtrinh: string) {
        return await this.promotionService.findAllProductByPromotion(machuongtrinh);
    }

    @Public()
    @Delete('deleteProductFromPromotion/:machuongtrinh/:masanpham')
    @ApiOperation({ summary: 'Xóa sản phẩm khỏi chương trình khuyến mãi' })
    async deleteProductFromPromotion(
        @Param('machuongtrinh') machuongtrinh: string,
        @Param('masanpham') masanpham: string
    ) {
        return await this.promotionService.deleteProductFromPromotion(machuongtrinh, masanpham);
    }
}