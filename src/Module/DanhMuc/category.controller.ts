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
    return {
      data: categories,
      message: 'Get all categories successfully'
    };
  }

  @Public()
  @Get('findCategory/:madanhmuc')
  async getCategoryById(@Param('madanhmuc') madanhmuc: string) {
    const category = await this.danhMucService.findOne(madanhmuc);
    return {
      data: category,
      message: 'Get category successfully'
    };
  }

  @Public()
  @Get('getDanhMucByLoai/:maloai')
  async getDanhMucByLoai(@Param('maloai') maloai: string) {
    const categories = await this.danhMucService.getDanhMucByLoai(maloai);
    return {
      data: categories,
      message: 'Get categories by loai successfully'
    };
  }

  @Roles(Role.Admin)
  @Post('createCategory')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const newCategory = await this.danhMucService.createCategory(createCategoryDto);
    return {
      data: newCategory,
      message: 'Create category successfully'
    };
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
    return {
      data: updatedCategory,
      message: 'Update category successfully'
    };
  }

  @Roles(Role.Admin)
  @Delete('deleteCategory/:madanhmuc')
  async deleteCategory(@Param('madanhmuc') madanhmuc: string) {
    const deletedCategory = await this.danhMucService.deleteCategory(madanhmuc);
    return {
      data: deletedCategory,
      message: 'Delete category successfully'
    };
  }

  @Roles(Role.Admin)
  @Post('updateAllNullSlugs')
  async updateAllNullSlugs() {
    const updatedCount = await this.danhMucService.updateAllNullSlugs();
    return {
      data: { updatedCount },
      message: `Updated slugs for ${updatedCount} categories successfully`
    };
  }
}
