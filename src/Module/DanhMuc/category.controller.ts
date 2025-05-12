import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { DanhMucService } from "./category.service";
import { Public } from "src/common/decorator/public.decorator";
import { Roles } from "src/common/decorator/roles.decorator";
import { Role } from "src/common/Enum/role.enum";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth('access-token')
@ApiTags('Category')
@Controller('category')
export class DanhMucController {
    constructor(
        private readonly danhMucService: DanhMucService
    ) {}
    @Public()
    @Get('getAllCategories')
    async getAllCategories() {
        const categories = await this.danhMucService.findAll();
        return categories;
    }

    @Public()
    @Get('findCategory/:madanhmuc')
    async getCategoryById(@Param('madanhmuc') madanhmuc: string) {
        const category = await this.danhMucService.findOne(madanhmuc);
        return category;
    }

    @Roles(Role.Admin, Role.Employee)
    @Post('createCategory')
    async createCategory(@Body('tendanhmuc') tendanhmuc: string) {
        const newCategory = await this.danhMucService.createCategory(tendanhmuc);
        return newCategory;
    }
    
    @Roles(Role.Admin, Role.Employee)
    @Put('updateCategory/:madanhmuc')
    async updateCategory(@Param('madanhmuc') madanhmuc: string, @Body('tendanhmuc') tendanhmuc: string) {
        const updatedCategory = await this.danhMucService.updateCategory(madanhmuc, tendanhmuc);
        return updatedCategory;
    }
    
    @Roles(Role.Admin, Role.Employee)
    @Delete('deleteCategory/:madanhmuc')
    async deleteCategory(@Param('madanhmuc') madanhmuc: string) {
        const deletedCategory = await this.danhMucService.deleteCategory(madanhmuc);
        return deletedCategory;
    }
}