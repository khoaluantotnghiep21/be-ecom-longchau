import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderDetail } from './orderDetail.entity';
import { OrderDetailService } from './orderDetail.service';
import { OrderDetailController } from './orderDetail.controller';

@Module({
  imports: [SequelizeModule.forFeature([OrderDetail])],
  providers: [OrderDetailService],
  controllers: [OrderDetailController],
})
export class OrderDetailModule {}
