import { Body, Controller, Post, Param, Req, NotFoundException } from '@nestjs/common';
import { PurchaseOrderService } from './purchaseOrder.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { OrderDetailsDto } from './dto/orderDetals.dto';
@ApiBearerAuth('access-token')

@ApiTags('Purchase Order')
@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Post('createNewPurchaseOrder')
  async createNewPurchaseOrder(@Req() req: Request, @Body() orderDetailsDto: OrderDetailsDto) {
    const userid = req['user']?.sub;
    if (!userid) {
      throw new NotFoundException('User ID not found in request');
    }
    return this.purchaseOrderService.createNewPurchaseOrder(userid, orderDetailsDto);
  }
    
  
}
