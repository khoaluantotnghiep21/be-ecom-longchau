import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PharmacyProductService } from './pharmacy-product.service';
import { CapNhatTonKhoDto, PharmacyProductDto, StatusDto, UpdatePharmacyProductDto } from './dto/pharmacy-product.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/Enum/role.enum';
import { Public } from 'src/common/decorator/public.decorator';
import { NhaThuoc_SanPham } from './pharmacy-product.entity';
import { MultiProductsDto } from './dto/multi-products.dto';
import { SimpleProductInputDto } from './dto/simple-product-input.dto';

@ApiTags('PharmacyProduct')
@Controller('pharmacy-product')
@ApiBearerAuth('access-token')
export class PharmacyProductController {
  constructor(private readonly pharmacyProductService: PharmacyProductService) { }

  //   @Post('createNewOrder')
  //   @ApiOperation({ summary: 'Thêm sản phẩm vào nhà thuốc' })
  //   @ApiBody({ type: PharmacyProductDto })
  //   async createPharmacyProduct(
  //     @Body() pharmacyProductDto: PharmacyProductDto,
  //     @Request() req
  //   ): Promise<NhaThuoc_SanPham> {
  //     const userid = req['user']?.sub;
  //     return await this.pharmacyProductService.createPharmacyProduct(pharmacyProductDto, userid);
  //   }

  @Post('createMultipleProducts')
  @ApiOperation({ summary: 'Thêm nhiều sản phẩm vào nhà thuốc với cùng mã chi nhánh' })
  @ApiBody({ type: MultiProductsDto })
  async createMultipleProducts(
    @Body() multiProductsDto: MultiProductsDto,
    @Request() req
  ) {
    const userid = req['user']?.sub;
    return await this.pharmacyProductService.createMultipleProducts(multiProductsDto, userid);
  }

  @Get('getIdPharmacyProductById:id')
  @Public()
  @ApiOperation({ summary: 'Lấy thông tin sản phẩm nhà thuốc theo mã chi nhánh ' })
  async getPharmacyProductById(@Param('machinhanh') machinhanh: string): Promise<any[]> {
    return await this.pharmacyProductService.getPharmacyProductById(machinhanh);
  }

  @Get('getListPharmacyProducts')
  @Public()
  @ApiOperation({ summary: 'Lấy tất cả sản phẩm nhà thuốc' })

  async getAllPharmacyProducts(
  ): Promise<any> {

    return await this.pharmacyProductService.getAllPharmacyProducts();
  }

  @Get('getListProductInPharmacy/:machinhanh')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm của một chi nhánh nhà thuốc' })
  @ApiParam({ name: 'machinhanh', description: 'Mã chi nhánh nhà thuốc' })

  async getProductsByBranch(
    @Param('machinhanh') machinhanh: string,
  ): Promise<any[]> {
    return await this.pharmacyProductService.getProductsByBranch(machinhanh);
  }

  @Put('updateInfoPharmacyProduct:id')
  @ApiOperation({ summary: 'Cập nhật thông tin sản phẩm nhà thuốc' })
  @ApiParam({ name: 'id', description: 'ID của thông tin sản phẩm nhà thuốc' })
  @ApiBody({ type: UpdatePharmacyProductDto })
  async updatePharmacyProduct(
    @Param('id') id: string,
    @Body() updatePharmacyProductDto: UpdatePharmacyProductDto,
    @Request() req
  ): Promise<NhaThuoc_SanPham> {
    // Lấy ID của user đang đăng nhập từ request
    const userid = req['user']?.sub;
    return await this.pharmacyProductService.updatePharmacyProduct(id, updatePharmacyProductDto, userid);
  }

  @Put('updateStatus/:manhaphang')
  @ApiOperation({ summary: 'Cập nhật tình trạng sản phẩm nhà thuốc' })
  @ApiParam({ name: 'manhaphang', description: 'Mã Nhập hàng của thông tin sản phẩm nhà thuốc' })

  async updateProductStatus(
    @Param('manhaphang') manhaphang: string
  ): Promise<NhaThuoc_SanPham[]> {

    return await this.pharmacyProductService.updateProductStatus(manhaphang);
  }

  @Delete('deletePharmacyProduct:id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Xóa thông tin sản phẩm nhà thuốc' })
  @ApiParam({ name: 'id', description: 'ID của thông tin sản phẩm nhà thuốc' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thông tin sản phẩm nhà thuốc' })
  async deletePharmacyProduct(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    return await this.pharmacyProductService.deletePharmacyProduct(id);
  }

  @Get('search/:term')
  @Public()
  @ApiOperation({ summary: 'Tìm kiếm sản phẩm nhà thuốc' })
  @ApiParam({ name: 'term', description: 'Từ khóa tìm kiếm' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  async searchPharmacyProducts(@Param('term') term: string): Promise<any[]> {
    return await this.pharmacyProductService.searchPharmacyProducts(term);
  }

  @Get('checkProduct/:masanpham')
  @Public()
  @ApiOperation({ summary: 'Kiểm tra sản phẩm tồn tại trong cơ sở dữ liệu' })
  @ApiParam({ name: 'masanpham', description: 'Mã sản phẩm cần kiểm tra' })
  async checkProduct(@Param('masanpham') masanpham: string) {
    return await this.pharmacyProductService.checkProduct(masanpham);
  }

  @Public()
  @Post('checkUnitDetails')
  @ApiOperation({ summary: 'Kiểm tra chi tiết đơn vị của danh sách sản phẩm' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        masanpham: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'Danh sách mã sản phẩm cần kiểm tra'
        }
      }
    }
  })
  async checkUnitDetails(@Body() body: { masanpham: string[] }) {
    return await this.pharmacyProductService.checkUnitDetails(body.masanpham);
  }


  @Public()
  @Put('updateTonKho/:machinhanh/:masanpham')
  @ApiOperation({ summary: 'Cập nhật tồn kho của sản phẩm trong chi nhánh nhà thuốc' })
  async updateTonKho(
    @Param('machinhanh') machinhanh: string,
    @Param('masanpham') masanpham: string,
    @Body() capNhatTonKho: CapNhatTonKhoDto): Promise<NhaThuoc_SanPham> {
    return await this.pharmacyProductService.updateTonKho(machinhanh, masanpham, capNhatTonKho);
  }


  @Public()
  @Get('stats/import/:type')
  async getImportStats(@Param('type') type: 'day' | 'week' | 'month') {
    return this.pharmacyProductService.getImportStatsByProduct(type);
  }
}
