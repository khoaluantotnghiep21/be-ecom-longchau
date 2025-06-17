import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PurchaseOrder } from './purchaseOrder.entity';
import { PurchaseOrderService } from './purchaseOrder.service';
import { PurchaseOrderController } from './purchaseOrder.controller';
import { AuthGuard } from 'src/guards/auth.guards';
import { IdentityUser } from '../IdentityUser/identityuser.entity';
import { PDFService } from './pdf.service';

@Module({
  imports: [SequelizeModule.forFeature([PurchaseOrder, IdentityUser])],
  providers: [PurchaseOrderService, PDFService, AuthGuard],
  controllers: [PurchaseOrderController],
  exports: [AuthGuard]
})
export class PurchaseOrderModule {}
