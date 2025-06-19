import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';
import { SanPhamService } from './product.service';
import { SanPham } from './product.entity';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/Enum/role.enum';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/updateProduct.dto';

@ApiBearerAuth('access-token')
@ApiTags('Product')
@Controller('product')
export class SanPhamController {
  constructor(private readonly sanPhamService: SanPhamService) { }

  @Roles(Role.Admin, Role.Staff)
  @Post('createProduct')
  async create(@Body() createProductDto: CreateProductDto): Promise<SanPham> {
    return this.sanPhamService.createNewProduct(createProductDto);
  }

  @Public()
  @Get('getAllProducts')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  async findAll(@Query('page') page?: number, @Query('take') take?: number) {
    return this.sanPhamService.findAllProduct(page, take);
  }
  @Public()
  @Get('findProduct/:masanpham')
  async findOne(@Param('masanpham') masanpham: string): Promise<SanPham> {
    return await this.sanPhamService.findOneProduct(masanpham);
  }

  @Public()
  @Get('findProductsByCategory/:madanhmuc')
  async findOneProductByCategory(@Param('madanhmuc') madanhmuc: string) {
    return await this.sanPhamService.findOneProductByCategory(madanhmuc);
  }

  @Roles(Role.Admin, Role.Staff)
  @Put('updateProduct/:masanpham')
  async updateProduct(
    @Param('masanpham') masanpham: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<SanPham> {
    return await this.sanPhamService.updateProduct(masanpham, updateProductDto);
  }
  @Public()
  @Get('findProductBySlug/:slug')
  async findProductBySlug(@Param('slug') slug: string): Promise<SanPham> {
    return await this.sanPhamService.findProductBySlug(slug);
  }
  @Roles(Role.Admin, Role.Staff)
  @Delete('deleteProduct/:masanpham')
  async delete(@Param('masanpham') masanpham: string) {
    return await this.sanPhamService.deleteProduct(masanpham);
  }
  @Public()
  @Get('search')
  @ApiQuery({ name: 'query', required: true, type: String, description: 'Search query string' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (optional, default: 1)' })
  @ApiQuery({ name: 'take', required: false, type: Number, description: 'Items per page (optional, default: 12)' })
  async searchProducts(
    @Query('query') query: string,
    @Query('page') page?: number,
    @Query('take') take?: number,
  ) {
    if (!query || query.trim() === '') {
      throw new HttpException('Query is required', HttpStatus.BAD_REQUEST);
    }
    // Giải mã query để xử lý tiếng Việt
    const decodedQuery = decodeURIComponent(query);
    return this.sanPhamService.searchProducts(decodedQuery, page, take);
  }
}
