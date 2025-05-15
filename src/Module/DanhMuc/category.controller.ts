import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DanhMucService } from './category.service';
import { Public } from 'src/common/decorator/public.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/Enum/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/createCategory.dto';

@ApiBearerAuth('access-token')
@ApiTags('Category')
@Controller('category')
export class DanhMucController {
  constructor(private readonly danhMucService: DanhMucService) {}
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

  @Public()
  @Get('getDanhMucByLoai/:maloai')
  async getDanhMucByLoai(@Param('maloai') maloai: string) {
    const categories = await this.danhMucService.getDanhMucByLoai(maloai);
    return categories;
  }

  @Roles(Role.Admin)
  @Post('createCategory')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const newCategory =
      await this.danhMucService.createCategory(createCategoryDto);
    return newCategory;
  }

  @Roles(Role.Admin)
  @Put('updateCategory/:madanhmuc')
  async updateCategory(
    @Param('madanhmuc') madanhmuc: string,
    @Body() updateCategoryDto: CreateCategoryDto,
  ) {
    const updatedCategory = await this.danhMucService.updateCategory(
      madanhmuc,
      updateCategoryDto,
    );
    return updatedCategory;
  }

  @Roles(Role.Admin)
  @Delete('deleteCategory/:madanhmuc')
  async deleteCategory(@Param('madanhmuc') madanhmuc: string) {
    const deletedCategory = await this.danhMucService.deleteCategory(madanhmuc);
    return deletedCategory;
  }
}
