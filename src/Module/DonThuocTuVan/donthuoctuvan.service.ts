import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DonThuocTuVan } from './donthuoctuvan.entity';
import { CreateDonThuocTuVanDto, UpdateDonThuocTuVanDto } from './dto/donthuoctuvan.dto';
import { Repository } from 'sequelize-typescript';
import { PurchaseOrder } from '../DonHang/purchaseOrder.entity';

@Injectable()
export class DonThuocTuVanService {
  constructor(
    @InjectModel(DonThuocTuVan)
    private readonly donThuocTuVanRepository: Repository<DonThuocTuVan>,
    @InjectModel(PurchaseOrder) 
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
  ) {}

  /**
   * Tạo một đơn thuốc tư vấn mới
   * @param createDonThuocTuVanDto Thông tin đơn tư vấn mới
   * @returns Đơn tư vấn đã tạo
   */
  async create(createDonThuocTuVanDto: CreateDonThuocTuVanDto): Promise<DonThuocTuVan> {
    const order = await this.purchaseOrderRepository.findOne({where: { madonhang: createDonThuocTuVanDto.madonhang }});
    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với mã ${createDonThuocTuVanDto.madonhang}`);
    }
    return await this.donThuocTuVanRepository.create({
      ...createDonThuocTuVanDto,
    });
  }

  /**
   * Lấy tất cả đơn thuốc tư vấn
   * @returns Danh sách tất cả đơn tư vấn
   */
  async findAll(): Promise<DonThuocTuVan[]> {
    return await this.donThuocTuVanRepository.findAll();
  }

  /**
   * Tìm đơn thuốc tư vấn theo ID
   * @param id ID của đơn tư vấn
   * @returns Đơn tư vấn
   */
  async findOne(id: string): Promise<DonThuocTuVan> {
    const donThuocTuVan = await this.donThuocTuVanRepository.findByPk(id);
    
    if (!donThuocTuVan) {
      throw new NotFoundException(`Không tìm thấy đơn tư vấn với ID ${id}`);
    }
    
    return donThuocTuVan;
  }

  /**
   * Tìm đơn thuốc tư vấn theo mã đơn hàng
   * @param madonhang Mã đơn hàng
   * @returns Danh sách đơn tư vấn liên quan
   */
  async findByMaDonHang(madonhang: string): Promise<DonThuocTuVan[]> {
    return await this.donThuocTuVanRepository.findAll({
      where: { madonhang },
    });
  }

  /**
   * Cập nhật đơn thuốc tư vấn
   * @param id ID của đơn tư vấn
   * @param updateDonThuocTuVanDto Dữ liệu cập nhật
   * @returns Đơn tư vấn sau khi cập nhật
   */
  async update(id: string, updateDonThuocTuVanDto: UpdateDonThuocTuVanDto): Promise<DonThuocTuVan> {
    const donThuocTuVan = await this.findOne(id);
    
    await donThuocTuVan.update(updateDonThuocTuVanDto);
    
    return donThuocTuVan;
  }

  /**
   * Xóa đơn thuốc tư vấn
   * @param id ID của đơn tư vấn
   * @returns Thông báo kết quả
   */
  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const donThuocTuVan = await this.findOne(id);
    
    await donThuocTuVan.destroy();
    
    return {
      success: true,
      message: `Đã xóa đơn tư vấn với ID ${id}`,
    };
  }
}
