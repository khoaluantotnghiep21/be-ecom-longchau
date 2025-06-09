import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GiaoHang } from './delivery.entity';
import { DeliveryDto, UpdateDeliveryDto } from './dto/delivery.dto';
import { Op } from 'sequelize';
import { PurchaseOrder } from '../DonHang/purchaseOrder.entity';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(GiaoHang)
    private readonly deliveryModel: typeof GiaoHang,
    @InjectModel(PurchaseOrder)
    private readonly orderModel: typeof PurchaseOrder,
  ) {}

  /**
   * Tạo thông tin giao hàng mới
   * @param deliveryDto Thông tin giao hàng
   * @returns Thông tin giao hàng đã tạo
   */
  async createDelivery(deliveryDto: DeliveryDto): Promise<GiaoHang> {
    // Kiểm tra đơn hàng tồn tại
    const orderExists = await this.orderModel.findOne({
      where: { madonhang: deliveryDto.madonhang },
    });

    if (!orderExists) {
      throw new NotFoundException(
        `Không tìm thấy đơn hàng với mã ${deliveryDto.madonhang}`,
      );
    }

    // Kiểm tra xem đơn hàng đã có thông tin giao hàng chưa
    const existingDelivery = await this.deliveryModel.findOne({
      where: { madonhang: deliveryDto.madonhang },
    });

    if (existingDelivery) {
      throw new Error(
        `Đơn hàng ${deliveryDto.madonhang} đã có thông tin giao hàng`,
      );
    }

    return await this.deliveryModel.create({
      ...deliveryDto,
      trangthai: deliveryDto.trangthai || 'Đang chuẩn bị hàng',
    });
  }

  /**
   * Lấy thông tin giao hàng theo ID
   * @param id ID của thông tin giao hàng
   * @returns Thông tin giao hàng
   */
  async getDeliveryById(id: string): Promise<GiaoHang> {
    const delivery = await this.deliveryModel.findByPk(id);
    if (!delivery) {
      throw new NotFoundException(`Không tìm thấy thông tin giao hàng với ID ${id}`);
    }
    return delivery;
  }

  /**
   * Lấy thông tin giao hàng theo mã đơn hàng
   * @param madonhang Mã đơn hàng
   * @returns Thông tin giao hàng
   */
  async getDeliveryByOrderId(madonhang: string): Promise<GiaoHang> {
    const delivery = await this.deliveryModel.findOne({
      where: { madonhang },
    });
    
    if (!delivery) {
      throw new NotFoundException(
        `Không tìm thấy thông tin giao hàng cho đơn hàng ${madonhang}`,
      );
    }
    
    return delivery;
  }

  /**
   * Lấy tất cả thông tin giao hàng
   * @returns Danh sách thông tin giao hàng
   */
  async getAllDeliveries(): Promise<GiaoHang[]> {
    return await this.deliveryModel.findAll();
  }

  /**
   * Lấy danh sách giao hàng theo trạng thái
   * @param trangthai Trạng thái giao hàng
   * @returns Danh sách thông tin giao hàng theo trạng thái
   */
  async getDeliveriesByStatus(trangthai: string): Promise<GiaoHang[]> {
    return await this.deliveryModel.findAll({
      where: { trangthai },
    });
  }

  /**
   * Cập nhật thông tin giao hàng
   * @param id ID của thông tin giao hàng
   * @param updateDeliveryDto Thông tin cập nhật
   * @returns Thông tin giao hàng đã cập nhật
   */
  async updateDelivery(
    id: string,
    updateDeliveryDto: UpdateDeliveryDto,
  ): Promise<GiaoHang> {
    const delivery = await this.deliveryModel.findByPk(id);
    
    if (!delivery) {
      throw new NotFoundException(`Không tìm thấy thông tin giao hàng với ID ${id}`);
    }
    
    // Cập nhật thông tin
    await delivery.update(updateDeliveryDto);
    
    return delivery;
  }

  /**
   * Cập nhật trạng thái giao hàng
   * @param id ID của thông tin giao hàng
   * @param trangthai Trạng thái mới
   * @returns Thông tin giao hàng đã cập nhật
   */
  async updateDeliveryStatus(id: string, trangthai: string): Promise<GiaoHang> {
    const delivery = await this.deliveryModel.findByPk(id);
    
    if (!delivery) {
      throw new NotFoundException(`Không tìm thấy thông tin giao hàng với ID ${id}`);
    }
    
    // Cập nhật trạng thái
    await delivery.update({ trangthai });
    
    // Nếu trạng thái là "Đã giao", cập nhật thời gian nhận
    if (trangthai === 'Đã giao') {
      await delivery.update({ thoigiannhan: new Date() });
    }
    
    return delivery;
  }

  /**
   * Xóa thông tin giao hàng
   * @param id ID của thông tin giao hàng
   * @returns Thông báo kết quả
   */
  async deleteDelivery(id: string): Promise<{ success: boolean; message: string }> {
    const delivery = await this.deliveryModel.findByPk(id);
    
    if (!delivery) {
      throw new NotFoundException(`Không tìm thấy thông tin giao hàng với ID ${id}`);
    }
    
    await delivery.destroy();
    
    return {
      success: true,
      message: 'Xóa thông tin giao hàng thành công',
    };
  }

  /**
   * Tìm kiếm thông tin giao hàng
   * @param searchTerm Từ khóa tìm kiếm
   * @returns Danh sách thông tin giao hàng phù hợp
   */
  async searchDeliveries(searchTerm: string): Promise<GiaoHang[]> {
    return await this.deliveryModel.findAll({
      where: {
        [Op.or]: [
          { nguoidat: { [Op.like]: `%${searchTerm}%` } },
          { nguoinhan: { [Op.like]: `%${searchTerm}%` } },
          { madonhang: { [Op.like]: `%${searchTerm}%` } },
          { trangthai: { [Op.like]: `%${searchTerm}%` } },
        ],
      },
    });
  }
}
