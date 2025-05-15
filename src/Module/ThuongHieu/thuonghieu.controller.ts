import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ThuongHieuService } from "./thuonghieu.service";
import { CreateBrandDto } from "./dto/createBrand.dto";
import { Public } from "src/common/decorator/public.decorator";
import { Roles } from "src/common/decorator/roles.decorator";
import { Role } from "src/common/Enum/role.enum";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth('access-token')
@ApiTags('Brand')
@Controller('brand')
export class ThuongHieuController {
    constructor(
         private readonly thuongHieuService: ThuongHieuService
    ) {}

    @Public()
    @Get('getAllBrands')
    async getAllBrands() {
        const brands = await this.thuongHieuService.findAll();
        return brands;
    }
    @Public()
    @Get('findBrand/:mathuonghieu')
    async getBrandById(@Param('mathuonghieu') mathuonghieu: string) {
        const brand = await this.thuongHieuService.findOne(mathuonghieu);
        return brand;
    }
    @Roles(Role.Admin, Role.Staff)
    @Post('createBrand')
    async createBrand(@Body() createBrandDto: CreateBrandDto) {
        const newBrand = await this.thuongHieuService.createBrand(createBrandDto);
        return newBrand;
    }

    @Roles(Role.Admin, Role.Staff)
    @Put('updateBrand/:mathuonghieu')
    async updateBrand(@Param('mathuonghieu') mathuonghieu: string, @Body() updateBrandDto: CreateBrandDto) {
        const updatedBrand = await this.thuongHieuService.updateBrand(mathuonghieu, updateBrandDto);
        return updatedBrand;
    }

    @Roles(Role.Admin, Role.Staff)
    @Delete('deleteBrand/:mathuonghieu')
    async deleteBrand(@Param('mathuonghieu') mathuonghieu: string) {
        const deletedBrand = await this.thuongHieuService.deleteBrand(mathuonghieu);
        return deletedBrand;
    }
}