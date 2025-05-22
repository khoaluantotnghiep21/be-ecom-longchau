/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomInt } from 'crypto';
import { Repository } from 'sequelize-typescript';
import { SanPham } from './product.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { slugify } from 'src/common/Utils/slugify';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { DanhMuc } from '../DanhMuc/category.entity';
import { ThuongHieu } from '../ThuongHieu/thuonghieu.entity';
import { Promotion } from '../ChuongTrinh/promotion.entity';
import { Media } from '../Media/media.entity';
import { Unit } from '../DonViTinh/donvitinh.entity';
import { UnitDetals } from '../ChiTietDonViTinh/chitietdonvitinh.entity';
import { IngredientDetals } from '../ChiTietThanhPhan/ingredientDetals.entity';
import { Ingredient } from '../ThanhPhan/ingredient.entity';

@Injectable()
export class SanPhamService {
  constructor(
    @InjectModel(SanPham)
    private readonly sanPhamModel: Repository<SanPham>,
    @InjectModel(DanhMuc)
    private readonly danhMucModel: Repository<DanhMuc>,
  ) {}

  async createNewProduct(createProductDto: CreateProductDto): Promise<SanPham> {
    const masanpham = 'SP' + randomInt(10000000, 99999999).toString();
    const slug = slugify(createProductDto.tensanpham);

    const data = { ...createProductDto, masanpham, slug };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newProduct = await this.sanPhamModel.create(data as any);

    const danhmuc = await this.danhMucModel.findOne({
      where: { madanhmuc: createProductDto.madanhmuc },
    });
    if (!danhmuc) {
      throw new Error('Caterory muc not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const soluongtang = danhmuc.dataValues.soluong + 1;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    danhmuc.set({ soluong: soluongtang });
    await danhmuc.save();

    return newProduct;
  }

  async findAllProduct(page?: number, take?: number) {
    const currentPage = page ? parseInt(page.toString()) : 1;
    const limit = take ? parseInt(take.toString()) : 10;
    const offset = (currentPage - 1) * limit;

    const { count, rows } = await this.sanPhamModel.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: DanhMuc,
          attributes: ['tendanhmuc', 'slug'],
        },
        {
          model: ThuongHieu,
          attributes: ['tenthuonghieu'],
        },
        {
          model: Promotion,
          attributes: ['tenchuongtrinh'],
        },
        {
          model: Media,
          attributes: ['url', 'ismain'],
        },
        {
          model: UnitDetals,
          attributes: ['dinhluong', 'giaban'],
          include: [
            {
              model: Unit,
              attributes: ['donvitinh'],
            },
          ],
        },
        {
          model: IngredientDetals,
          attributes: ['hamluong'],
          include: [
            {
              model: Ingredient,
              attributes: ['tenthanhphan'],
            },
          ],
        },
      ],
      distinct: true,
    });

    return {
      data: rows,
      meta: {
        total: count,
        page: currentPage,
        take: limit,
        pageCount: Math.ceil(count / limit),
      },
    };
  }

  async findOneProductByCategory(madanhmuc: string) {
    return this.sanPhamModel.findAll({
      where: { madanhmuc },
      include: [
        {
          model: DanhMuc,
          attributes: ['tendanhmuc'],
        },
        {
          model: ThuongHieu,
          attributes: ['tenthuonghieu'],
        },
        {
          model: Promotion,
          attributes: ['tenchuongtrinh'],
        },
        {
          model: Media,
          attributes: ['url', 'ismain'],
        },
        {
          model: UnitDetals,
          attributes: ['dinhluong', 'giaban'],
          include: [
            {
              model: Unit,
              attributes: ['donvitinh'],
            },
          ],
        },
        {
          model: IngredientDetals,
          attributes: ['hamluong'],
          include: [
            {
              model: Ingredient,
              attributes: ['tenthanhphan'],
            },
          ],
        },
      ],
    });
  }

  async findOneProduct(masanpham: string): Promise<SanPham> {
    const product = await this.sanPhamModel.findOne({
      where: { masanpham },
      include: [
        {
          model: DanhMuc,
          attributes: ['tendanhmuc'],
        },
        {
          model: ThuongHieu,
          attributes: ['tenthuonghieu'],
        },
        {
          model: Promotion,
          attributes: ['tenchuongtrinh'],
        },
        {
          model: Media,
          attributes: ['url', 'ismain'],
        },
        {
          model: UnitDetals,
          as: 'chitietdonvi',
          attributes: ['dinhluong', 'giaban'],
          include: [
            {
              model: Unit,
              attributes: ['donvitinh'],
            },
          ],
        },
        {
          model: IngredientDetals,
          attributes: ['hamluong'],
          include: [
            {
              model: Ingredient,
              attributes: ['tenthanhphan'],
            },
          ],
        },
      ],
    });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async updateProduct(
    masanpham: string,
    updateProductDto: UpdateProductDto,
  ): Promise<SanPham> {
    const product = await this.sanPhamModel.findOne({ where: { masanpham } });
    if (!product) {
      throw new Error('Product not found');
    }

    const slug = slugify(updateProductDto.tensanpham);
    const oldCategoryId = product.dataValues.madanhmuc;
    const newCategoryId = updateProductDto.madanhmuc;

    // Cập nhật các trường thông tin sản phẩm
    product.set({ ...updateProductDto, slug });

    if (oldCategoryId !== newCategoryId) {
      const oldCategory = await this.danhMucModel.findOne({
        where: { madanhmuc: oldCategoryId },
      });
      const newCategory = await this.danhMucModel.findOne({
        where: { madanhmuc: newCategoryId },
      });

      if (!oldCategory || !newCategory) {
        throw new Error('Category not found');
      }

      // Giảm ở danh mục cũ
      const soluonggiam = oldCategory.dataValues.soluong - 1;
      oldCategory.set({ soluong: soluonggiam });
      console.log('soluonggiam', soluonggiam);
      await oldCategory.save();

      // Tăng ở danh mục mới
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const soluongtang = newCategory.dataValues.soluong + 1;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      newCategory.set({ soluong: soluongtang });
      console.log('soluongtang', soluongtang);

      await newCategory.save();
    }

    return await product.save();
  }

  async deleteProduct(masanpham: string) {
    const product = await this.sanPhamModel.findOne({ where: { masanpham } });
    if (!product) {
      throw new Error('Product not found');
    }
    const danhmuc = await this.danhMucModel.findOne({
      where: { madanhmuc: product.dataValues.madanhmuc },
    });
    if (!danhmuc) {
      throw new Error('Caterory not found');
    }
    console.log('danhmuc', product.dataValues.madanhmuc);
    const soluonggiam = danhmuc.dataValues.soluong - 1;
    console.log('soluonggiam', soluonggiam);
    danhmuc.set({ soluong: soluonggiam });
    await danhmuc.save();
    return this.sanPhamModel.destroy({ where: { masanpham } });
  }
}
