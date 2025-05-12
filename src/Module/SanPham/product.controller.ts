import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';
import { SanPhamService } from './product.service';
import { SanPham } from './product.entity';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/Enum/role.enum';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
  async findAll(): Promise<SanPham[]> {
    return this.sanPhamService.findAllProduct();
  }
  @Public()
  @Get('findProduct/:masanpham')
  async findOne(@Param('masanpham') masanpham: string): Promise<SanPham> {
    return await this.sanPhamService.findOneProduct(masanpham);
  }

  @Roles(Role.Admin, Role.Employee)
  @Put('updateProduct/:masanpham')
  async updateProduct(@Param('masanpham') masanpham: string, @Body() updateProductDto: CreateProductDto): Promise<SanPham> {
    return await this.sanPhamService.updateProduct(masanpham, updateProductDto);
  }
  
  @Roles(Role.Admin, Role.Employee)
  @Delete('deleteProduct/:masanpham')
  async delete(@Param('masanpham') masanpham: string) {
    return  await this.sanPhamService.deleteProduct(masanpham);
  }
}
