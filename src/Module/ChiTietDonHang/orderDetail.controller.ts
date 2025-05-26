import { Controller, Get, Param } from '@nestjs/common';
import { OrderDetailService } from './orderDetail.service';

@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

 
}
