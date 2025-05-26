import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderDetail } from './orderDetail.entity';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectModel(OrderDetail)
    private readonly orderDetailModel: typeof OrderDetail,
  ) {}

  async findAll(): Promise<OrderDetail[]> {
    return this.orderDetailModel.findAll();
  }

  async findByOrderId(madonhang: string): Promise<OrderDetail[]> {
    return this.orderDetailModel.findAll({ where: { madonhang } });
  }
}
