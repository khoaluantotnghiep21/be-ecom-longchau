import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GiaoHang } from './delivery.entity';
import { CreateDeliveryDto, UpdateDeliveryDto } from './dto/delivery.dto';
import { Sequelize } from 'sequelize-typescript';
import { PurchaseOrder } from '../DonHang/purchaseOrder.entity';
import { QueryTypes } from 'sequelize';
import { OrderDetail } from '../ChiTietDonHang/orderDetail.entity';
import { DeliveryStatus } from 'src/common/Enum/delivery-status.enum';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(GiaoHang)
    private readonly deliveryModel: typeof GiaoHang,
    @InjectModel(PurchaseOrder)
    private readonly purchaseOrderModel: typeof PurchaseOrder,
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Tạo mới đơn giao hàng
   * @param createDeliveryDto Thông tin đơn giao hàng
   * @returns Đơn giao hàng đã tạo
   */
  async createDelivery(createDeliveryDto: CreateDeliveryDto): Promise<GiaoHang> {
    // Kiểm tra đơn hàng tồn tại
    const order = await this.purchaseOrderModel.findOne({
      where: { madonhang: createDeliveryDto.madonhang }
    });

    if (!order) {
      throw new NotFoundException(
        `Không tìm thấy đơn hàng với mã ${createDeliveryDto.madonhang}`
      );
    }

    // Kiểm tra xem đã có đơn giao hàng cho đơn hàng này chưa
    const existingDelivery = await this.deliveryModel.findOne({
      where: { madonhang: createDeliveryDto.madonhang }
    });

    if (existingDelivery) {
      throw new BadRequestException(
        `Đã tồn tại đơn giao hàng cho đơn hàng ${createDeliveryDto.madonhang}`
      );
    }

    // Tính thời gian dự kiến giao hàng (từ 1-2 tiếng kể từ hiện tại)
    const now = new Date();
    const estimatedTime = new Date(now.getTime() + Math.random() * (2 - 1) * 60 * 60 * 1000 + 60 * 60 * 1000);

    // Tạo đơn giao hàng mới
    return await this.deliveryModel.create({
      ...createDeliveryDto,
      thoigiandukien: estimatedTime,
      trangthai: DeliveryStatus.DELIVERING,
    });
  }

  /**
   * Xác nhận đơn giao hàng thành công
   * @param id ID của đơn giao hàng
   * @returns Đơn giao hàng đã cập nhật
   */
  async confirmDelivery(id: string): Promise<GiaoHang> {
    const delivery = await this.deliveryModel.findByPk(id);
    if (!delivery) {
      throw new NotFoundException(`Không tìm thấy đơn giao hàng với ID ${id}`);
    }

    // Cập nhật trạng thái và thời gian nhận hàng
    await delivery.update({
      thoigiannhan: new Date(),
      trangthai: DeliveryStatus.DELIVERED,
    });

    return delivery;
  }

  /**
   * Lấy danh sách tất cả đơn giao hàng
   * @returns Danh sách đơn giao hàng
   */
  async getAllDeliveries(): Promise<any[]> {
    const deliveries = await this.sequelize.query(
      `
      SELECT g.*, dh.madonhang, dh.ngaymuahang, dh.tongtien, dh.userid
      FROM giaohang g
      JOIN donhang dh ON g.madonhang = dh.madonhang
      ORDER BY dh.ngaymuahang DESC
      `,
      {
        type: QueryTypes.SELECT
      }
    );

    return deliveries;
  }

  /**
   * Lấy chi tiết của một đơn giao hàng, bao gồm thông tin đơn hàng và chi tiết đơn hàng
   * @param id ID của đơn giao hàng
   * @returns Chi tiết đơn giao hàng
   */
  async getDeliveryDetails(id: string): Promise<any> {
    const delivery = await this.deliveryModel.findByPk(id);
    if (!delivery) {
      throw new NotFoundException(`Không tìm thấy đơn giao hàng với ID ${id}`);
    }

    // Lấy thông tin đơn hàng
    const order = await this.purchaseOrderModel.findOne({
      where: { madonhang: delivery.madonhang }
    });

    // Lấy chi tiết đơn hàng
    const orderDetails = await this.sequelize.query(
      `
      SELECT ct.*, sp.tensanpham, sp.masanpham
      FROM chitietdonhang ct
      JOIN sanpham sp ON ct.masanpham = sp.masanpham
      WHERE ct.madonhang = :madonhang
      `,
      {
        replacements: { madonhang: delivery.madonhang },
        type: QueryTypes.SELECT
      }
    );

    return {
      delivery,
      order,
      orderDetails
    };
  }

  /**
   * Cập nhật thông tin đơn giao hàng
   * @param id ID của đơn giao hàng
   * @param updateDeliveryDto Thông tin cần cập nhật
   * @returns Đơn giao hàng đã cập nhật
   */
  async updateDelivery(id: string, updateDeliveryDto: UpdateDeliveryDto): Promise<GiaoHang> {
    const delivery = await this.deliveryModel.findByPk(id);
    if (!delivery) {
      throw new NotFoundException(`Không tìm thấy đơn giao hàng với ID ${id}`);
    }

    await delivery.update(updateDeliveryDto);
    return delivery;
  }
}
