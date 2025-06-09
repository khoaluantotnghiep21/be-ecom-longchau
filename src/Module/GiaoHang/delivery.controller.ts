import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { DeliveryService } from './delivery.service';
import { DeliveryDto, UpdateDeliveryDto } from './dto/delivery.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/Enum/role.enum';
import { Public } from 'src/common/decorator/public.decorator';
import { GiaoHang } from './delivery.entity';

@ApiTags('Delivery')
@Controller('delivery')
@ApiBearerAuth('access-token')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post('create')
  @Roles(Role.Admin, Role.Staff)
  @ApiOperation({ summary: 'Tạo thông tin giao hàng mới' })
  @ApiBody({ type: DeliveryDto })
  @ApiResponse({ status: 201, description: 'Tạo thông tin giao hàng thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  async createDelivery(@Body() deliveryDto: DeliveryDto): Promise<GiaoHang> {
    return await this.deliveryService.createDelivery(deliveryDto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Lấy thông tin giao hàng theo ID' })
  @ApiParam({ name: 'id', description: 'ID của thông tin giao hàng' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thông tin giao hàng' })
  async getDeliveryById(@Param('id') id: string): Promise<GiaoHang> {
    return await this.deliveryService.getDeliveryById(id);
  }

  @Get('order/:madonhang')
  @Public()
  @ApiOperation({ summary: 'Lấy thông tin giao hàng theo mã đơn hàng' })
  @ApiParam({ name: 'madonhang', description: 'Mã đơn hàng' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thông tin giao hàng' })
  async getDeliveryByOrderId(
    @Param('madonhang') madonhang: string,
  ): Promise<GiaoHang> {
    return await this.deliveryService.getDeliveryByOrderId(madonhang);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy tất cả thông tin giao hàng' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  async getAllDeliveries(): Promise<GiaoHang[]> {
    return await this.deliveryService.getAllDeliveries();
  }

  @Get('status/:trangthai')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách giao hàng theo trạng thái' })
  @ApiParam({ name: 'trangthai', description: 'Trạng thái giao hàng' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  async getDeliveriesByStatus(
    @Param('trangthai') trangthai: string,
  ): Promise<GiaoHang[]> {
    return await this.deliveryService.getDeliveriesByStatus(trangthai);
  }

  @Put(':id')
  @Roles(Role.Admin, Role.Staff)
  @ApiOperation({ summary: 'Cập nhật thông tin giao hàng' })
  @ApiParam({ name: 'id', description: 'ID của thông tin giao hàng' })
  @ApiBody({ type: UpdateDeliveryDto })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thông tin giao hàng' })
  async updateDelivery(
    @Param('id') id: string,
    @Body() updateDeliveryDto: UpdateDeliveryDto,
  ): Promise<GiaoHang> {
    return await this.deliveryService.updateDelivery(id, updateDeliveryDto);
  }

  @Put('status/:id')
  @Roles(Role.Admin, Role.Staff)
  @ApiOperation({ summary: 'Cập nhật trạng thái giao hàng' })
  @ApiParam({ name: 'id', description: 'ID của thông tin giao hàng' })
  @ApiQuery({ name: 'trangthai', description: 'Trạng thái mới' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thông tin giao hàng' })
  async updateDeliveryStatus(
    @Param('id') id: string,
    @Query('trangthai') trangthai: string,
  ): Promise<GiaoHang> {
    return await this.deliveryService.updateDeliveryStatus(id, trangthai);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Xóa thông tin giao hàng' })
  @ApiParam({ name: 'id', description: 'ID của thông tin giao hàng' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thông tin giao hàng' })
  async deleteDelivery(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    return await this.deliveryService.deleteDelivery(id);
  }

  @Get('search/:term')
  @Public()
  @ApiOperation({ summary: 'Tìm kiếm thông tin giao hàng' })
  @ApiParam({ name: 'term', description: 'Từ khóa tìm kiếm' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  async searchDeliveries(@Param('term') term: string): Promise<GiaoHang[]> {
    return await this.deliveryService.searchDeliveries(term);
  }
}
