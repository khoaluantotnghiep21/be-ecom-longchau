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
    return await this.danhMucService.findOne(madanhmuc);
    
  }

  @Public()
  @Get('getDanhMucByLoai/:maloai')
  async getDanhMucByLoai(@Param('maloai') maloai: string) {
    return await this.danhMucService.getDanhMucByLoai(maloai);
    
  }

  @Roles(Role.Admin)
  @Post('createCategory')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.danhMucService.createCategory(createCategoryDto);
    
  }

  @Roles(Role.Admin)
  @Put('updateCategory/:madanhmuc')
  async updateCategory(
    @Param('madanhmuc') madanhmuc: string,
    @Body() updateCategoryDto: CreateCategoryDto,
  ) {
    return await this.danhMucService.updateCategory(
      madanhmuc,
      updateCategoryDto,
    );
    
  }

  @Roles(Role.Admin)
  @Delete('deleteCategory/:madanhmuc')
  async deleteCategory(@Param('madanhmuc') madanhmuc: string) {
    return await this.danhMucService.deleteCategory(madanhmuc);
    
  }

  @Roles(Role.Admin)
  @Post('updateAllNullSlugs')
  async updateAllNullSlugs() {
   return await this.danhMucService.updateAllNullSlugs();
    
  }
}
