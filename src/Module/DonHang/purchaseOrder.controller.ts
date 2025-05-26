import { Body, Controller, Post, Param, Req } from '@nestjs/common';
import { PurchaseOrderService } from './purchaseOrder.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { OrderDetailsDto } from './dto/orderDetals.dto';
@ApiBearerAuth('access-token')

@ApiTags('Purchase Order')
@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

//   @Post('createNewPurchaseOrder')
//   async create(@Req() req: Request) {
//     const userid = req['user']?.sub;
    
//     console.log("heheh " + userid)
//     return this.purchaseOrderService.createNewPurchaseOrder(userid);
//   }
    
  @Post('addOrderDetails/:madonhang')
  async addOrderDetails(
    
    @Body() orderDetailDto: OrderDetailsDto
  ) {
    return this.purchaseOrderService.addOrderDetails(orderDetailDto);
  }
}
