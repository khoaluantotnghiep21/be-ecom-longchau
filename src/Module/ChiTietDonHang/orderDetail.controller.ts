import { Controller, Get, Param } from '@nestjs/common';
import { OrderDetailService } from './orderDetail.service';

@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Get()
  async findAll() {
    return this.orderDetailService.findAll();
  }

  @Get(':madonhang')
  async findByOrderId(@Param('madonhang') madonhang: string) {
    return this.orderDetailService.findByOrderId(madonhang);
  }
}
