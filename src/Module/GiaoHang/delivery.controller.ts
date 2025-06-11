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
import { 
  CreateDeliveryDto, 
  DeliveryDto, 
  UpdateDeliveryDto, 
  ConfirmDeliveryDto,
  GetDeliveryDetailsDto 
} from './dto/delivery.dto';
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
  @ApiOperation({ summary: 'Tạo mới đơn giao hàng' })
  @ApiBody({ type: CreateDeliveryDto })
  @ApiResponse({ status: 201, description: 'Tạo đơn giao hàng thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ hoặc đã có đơn giao hàng' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  async createDelivery(@Body() createDeliveryDto: CreateDeliveryDto): Promise<GiaoHang> {
    return await this.deliveryService.createDelivery(createDeliveryDto);
  }

  @Put('confirm/:id')
  @Roles(Role.Admin, Role.Staff)
  @ApiOperation({ summary: 'Xác nhận giao hàng thành công' })
  @ApiParam({ name: 'id', description: 'ID của đơn giao hàng' })
  @ApiResponse({ status: 200, description: 'Xác nhận thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn giao hàng' })
  async confirmDelivery(@Param('id') id: string): Promise<GiaoHang> {
    return await this.deliveryService.confirmDelivery(id);
  }

  @Get()
  @Roles(Role.Admin, Role.Staff)
  @ApiOperation({ summary: 'Lấy danh sách tất cả đơn giao hàng' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  async getAllDeliveries(): Promise<any[]> {
    return await this.deliveryService.getAllDeliveries();
  }

  @Get(':id/details')
  @Roles(Role.Admin, Role.Staff)
  @ApiOperation({ summary: 'Lấy chi tiết đơn giao hàng và đơn hàng' })
  @ApiParam({ name: 'id', description: 'ID của đơn giao hàng' })
  @ApiResponse({ status: 200, description: 'Lấy chi tiết thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn giao hàng' })
  async getDeliveryDetails(@Param('id') id: string): Promise<any> {
    return await this.deliveryService.getDeliveryDetails(id);
  }

  @Put(':id')
  @Roles(Role.Admin, Role.Staff)
  @ApiOperation({ summary: 'Cập nhật thông tin đơn giao hàng' })
  @ApiParam({ name: 'id', description: 'ID của đơn giao hàng' })
  @ApiBody({ type: UpdateDeliveryDto })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn giao hàng' })
  async updateDelivery(
    @Param('id') id: string,
    @Body() updateDeliveryDto: UpdateDeliveryDto
  ): Promise<GiaoHang> {
    return await this.deliveryService.updateDelivery(id, updateDeliveryDto);
  }
}
