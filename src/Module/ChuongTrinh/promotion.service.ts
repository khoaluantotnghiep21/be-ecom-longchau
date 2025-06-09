import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Promotion } from "./promotion.entity";
import { Repository } from "sequelize-typescript";
import { PromotionDto } from "./dto/promotion.dto";
import { randomInt } from "crypto";
import { SanPham } from "../SanPham/product.entity";
import { DanhMuc } from "../DanhMuc/category.entity";
import { ThuongHieu } from "../ThuongHieu/thuonghieu.entity";
import { Media } from "../Media/media.entity";
import { UnitDetals } from "../ChiTietDonViTinh/chitietdonvitinh.entity";
import { Unit } from "../DonViTinh/donvitinh.entity";
import { IngredientDetals } from "../ChiTietThanhPhan/ingredientDetals.entity";
import { Ingredient } from "../ThanhPhan/ingredient.entity";

@Injectable()
export class PromotionService{
    constructor(
        @InjectModel(Promotion)
        private readonly promotionRepo: Repository<Promotion>,
        @InjectModel(SanPham)
        private readonly sanPhamRepo: Repository<SanPham>
    ){}

    async createPromotion(promotionDto:PromotionDto):Promise<Promotion>{
        const machuongtrinh = "CT" + randomInt(10000, 90000)
        if(promotionDto.ngaybatdau > promotionDto.ngayketthuc){
            throw new Error("Error when creating the promotion date")
        }
        const data = {machuongtrinh, ...promotionDto}
        return await this.promotionRepo.create(data)
    }

    
    async updatePromotion(machuongtrinh: string, promotionDto:PromotionDto):Promise<Promotion>{
        const promotion = await this.promotionRepo.findOne({where: {machuongtrinh}})
        if(!promotion){
            throw new NotFoundException("Not found Promotion")
        }
        promotion.set(promotionDto)
        return await promotion.save()
    }

    async deletePromise(machuongtrinh){
        const promotion = await this.promotionRepo.findOne({where: {machuongtrinh}})
        if(!promotion){
            throw new NotFoundException("Not found Promotion")
        }
        return promotion.destroy()
    }

    async getAllPromotion(){
        return await this.promotionRepo.findAll();
    }

    /**
     * Cập nhật chương trình khuyến mãi cho danh sách sản phẩm
     * @param machuongtrinh Mã chương trình khuyến mãi
     * @param productIds Danh sách ID của các sản phẩm cần áp dụng
     * @returns Thông tin về số lượng sản phẩm đã được cập nhật
     */
    async applyPromotionToProducts(machuongtrinh: string, productIds: string[]): Promise<{ success: boolean; message: string; updatedCount: number }> {
        // Kiểm tra chương trình khuyến mãi có tồn tại không
        const promotion = await this.promotionRepo.findOne({ where: { machuongtrinh } });
        if (!promotion) {
            throw new NotFoundException(`Không tìm thấy chương trình khuyến mãi với mã ${machuongtrinh}`);
        }

        // Kiểm tra chương trình có còn hiệu lực không
        const currentDate = new Date();
        if (currentDate > promotion.dataValues.ngayketthuc) {
            throw new Error(`Chương trình khuyến mãi ${promotion.dataValues.tenchuongtrinh} đã hết hạn vào ngày ${promotion.ngayketthuc.toLocaleDateString('vi-VN')}`);
        }

        try {
            // Cập nhật machuongtrinh cho tất cả sản phẩm trong danh sách
            const [updatedCount] = await this.sanPhamRepo.update(
                { machuongtrinh },
                { where: { id: productIds } }
            );

            // Nếu không có sản phẩm nào được cập nhật
            if (updatedCount === 0) {
                return {
                    success: true,
                    message: "Không có sản phẩm nào được cập nhật. Có thể các ID sản phẩm không tồn tại.",
                    updatedCount: 0
                };
            }

            return {
                success: true,
                message: `Đã áp dụng chương trình khuyến mãi "${promotion.dataValues.tenchuongtrinh}" cho ${updatedCount} sản phẩm.`,
                updatedCount
            };
        } catch (error) {
            throw new Error(`Lỗi khi áp dụng chương trình khuyến mãi: ${error.message}`);
        }
    }

    /**
     * Xóa chương trình khuyến mãi khỏi danh sách sản phẩm
     * @param productIds Danh sách ID của các sản phẩm cần xóa khuyến mãi
     * @returns Thông tin về số lượng sản phẩm đã được cập nhật
     */
    async removePromotionFromProducts(productIds: string[]): Promise<{ success: boolean; message: string; updatedCount: number }> {
        try {
            // Đặt machuongtrinh thành null cho tất cả sản phẩm trong danh sách
            const [updatedCount] = await this.sanPhamRepo.update(
                { machuongtrinh: null as unknown as string },
                { where: { id: productIds } }
            );

            // Nếu không có sản phẩm nào được cập nhật
            if (updatedCount === 0) {
                return {
                    success: true,
                    message: "Không có sản phẩm nào được cập nhật. Có thể các ID sản phẩm không tồn tại.",
                    updatedCount: 0
                };
            }

            return {
                success: true,
                message: `Đã xóa chương trình khuyến mãi khỏi ${updatedCount} sản phẩm.`,
                updatedCount
            };
        } catch (error) {
            throw new Error(`Lỗi khi xóa chương trình khuyến mãi: ${error.message}`);
        }
    }

    async findAllProductByPromotion(machuongtrinh: string): Promise<any[]> {
        const products = await this.sanPhamRepo.findAll({
      where: { machuongtrinh },
      include: [
        { model: DanhMuc, attributes: ['tendanhmuc'] },
        { model: ThuongHieu, attributes: ['tenthuonghieu'] },
        { model: Promotion, attributes: ['tenchuongtrinh', 'giatrikhuyenmai'] },
        { model: Media, attributes: ['url', 'ismain'] },
        {
          model: UnitDetals,
          as: 'chitietdonvi',
          attributes: ['dinhluong', 'giaban'],
          include: [{ model: Unit, attributes: ['donvitinh'] }],
        },
        {
          model: IngredientDetals,
          attributes: ['hamluong'],
          include: [{ model: Ingredient, attributes: ['tenthanhphan'] }],
        },
      ],
      raw: false,
      nest: true,
    });

    return products.map((rawProduct: any) => {
      const product = rawProduct.get ? rawProduct.get({ plain: true }) : rawProduct;
      const khuyenmai = product.khuyenmai?.giatrikhuyenmai ?? 0;
      if (product.chitietdonvi && Array.isArray(product.chitietdonvi)) {
        product.chitietdonvi = product.chitietdonvi.map((donvi: any) => ({
          ...donvi,
          giabanSauKhuyenMai: donvi.giaban - (donvi.giaban * (khuyenmai / 100)),
        }));
      }
      return product;
    });
  }

  async deleteProductFromPromotion(machuongtrinh: string, masanpham: string): Promise<{ success: boolean; message: string }> {
    const promotion = await this.promotionRepo.findOne({ where: { machuongtrinh } });
    if (!promotion) {
      throw new NotFoundException(`Not found promotion with ${machuongtrinh}`);
    }

    const product = await this.sanPhamRepo.findOne({ where: {masanpham, machuongtrinh } });
    if (!product) {
      throw new NotFoundException(`Not found productId with ${masanpham} in Promotion ${promotion.dataValues.tenchuongtrinh}`);
    }

    product.set({ machuongtrinh: 'CT000' });
    await product.save();

    return {
      success: true,
      message: `Delete ${masanpham} with ${promotion.dataValues.tenchuongtrinh}`,
    };
  }
  async findProductWithNoPromotion(): Promise<any[]>{
    const products = await this.sanPhamRepo.findAll({
      where: { machuongtrinh: 'CT000' },
      include: [
        { model: DanhMuc, attributes: ['tendanhmuc'] },
        { model: ThuongHieu, attributes: ['tenthuonghieu'] },
        { model: Media, attributes: ['url', 'ismain'] },
        {
          model: UnitDetals,
          as: 'chitietdonvi',
          attributes: ['dinhluong', 'giaban'],
          include: [{ model: Unit, attributes: ['donvitinh'] }],
        },
        {
          model: IngredientDetals,
          attributes: ['hamluong'],
          include: [{ model: Ingredient, attributes: ['tenthanhphan'] }],
        },
      ],
      raw: false,
      nest: true,
    });

    return products.map((rawProduct: any) => {
      const product = rawProduct.get ? rawProduct.get({ plain: true }) : rawProduct;
      if (product.chitietdonvi && Array.isArray(product.chitietdonvi)) {
        product.chitietdonvi = product.chitietdonvi.map((donvi: any) => ({
          ...donvi,
          giabanSauKhuyenMai: donvi.giaban,
        }));
      }
      return product;
    });
  }
}