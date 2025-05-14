import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';
import { SanPhamService } from './product.service';
import { SanPham } from './product.entity';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/Enum/role.enum';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Product')
@Controller('product')
export class SanPhamController {
  constructor(private readonly sanPhamService: SanPhamService) {}

  @Roles(Role.Admin, Role.Employee)
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
  @Get('findOneProductByCategory/:madanhmuc')
  async findOneProductByCategory(@Param('madanhmuc') madanhmuc: string) {
    return await this.sanPhamService.findOneProductByCategory(madanhmuc);
  }

  @Roles(Role.Admin, Role.Employee)
  @Put('updateProduct/:masanpham')
  async updateProduct(
    @Param('masanpham') masanpham: string,
    @Body() updateProductDto: CreateProductDto,
  ): Promise<SanPham> {
    return await this.sanPhamService.updateProduct(masanpham, updateProductDto);
  }

  @Roles(Role.Admin, Role.Employee)
  @Delete('deleteProduct/:masanpham')
  async delete(@Param('masanpham') masanpham: string) {
    return await this.sanPhamService.deleteProduct(masanpham);
  }
}
