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
import { Op } from 'sequelize';

@Injectable()
export class SanPhamService {
  constructor(
    @InjectModel(SanPham)
    private readonly sanPhamModel: Repository<SanPham>,
    @InjectModel(DanhMuc)
    private readonly danhMucModel: Repository<DanhMuc>,
  ) { }

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
      order: [['tensanpham', 'ASC']],
      include: [
        { model: DanhMuc, attributes: ['tendanhmuc', 'slug'] },
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
      distinct: true,
    });

    const data = rows.map((rawProduct: any) => {
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

    return {
      data,
      meta: {
        total: count,
        page: currentPage,
        take: limit,
        pageCount: Math.ceil(count / limit),
      },
    };
  }

  async findOneProductByCategory(madanhmuc: string): Promise<any[]> {
    const products = await this.sanPhamModel.findAll({
      where: { madanhmuc },
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

  async findOneProduct(masanpham: string): Promise<SanPham> {
    const rawProduct = await this.sanPhamModel.findOne({
      where: { masanpham },
      include: [
        { model: DanhMuc, attributes: ['tendanhmuc'] },
        { model: ThuongHieu, attributes: ['tenthuonghieu'] },
        { model: Promotion, attributes: ['tenchuongtrinh', 'giatrikhuyenmai'] },
        { model: Media, attributes: ['url', 'ismain'] },
        {
          model: UnitDetals,
          as: 'chitietdonvi', // phải khớp với association trong model
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

    if (!rawProduct) {
      throw new Error('Product not found');
    }

    const product = rawProduct.get({ plain: true });

    const khuyenmai = product.khuyenmai?.giatrikhuyenmai ?? 0;


    if (product.chitietdonvi && Array.isArray(product.chitietdonvi)) {
      product.chitietdonvi = product.chitietdonvi.map((donvi: any) => ({
        ...donvi,
        giabanSauKhuyenMai: donvi.giaban - (donvi.giaban * (khuyenmai / 100))

      }));
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




  async searchProducts(query: string, page?: number, take?: number) {
    if (!query) {
      throw new Error('Query is required');
    }

    const currentPage = page ? parseInt(page.toString()) : 1;
    const limit = take ? parseInt(take.toString()) : 10;
    const offset = (currentPage - 1) * limit;

    // Chuyển query thành dạng không dấu để tìm kiếm
    const queryWithoutDiacritics = slugify(query);

    const { count, rows } = await this.sanPhamModel.findAndCountAll({
      where: {
        [Op.or]: [
          { tensanpham: { [Op.iLike]: `%${query}%` } }, // Tìm kiếm có dấu trong tensanpham
          { masanpham: { [Op.iLike]: `%${query}%` } }, // Tìm kiếm trong masanpham
          { slug: { [Op.iLike]: `%${queryWithoutDiacritics}%` } }, // Tìm kiếm không dấu trong slug
          { slug: { [Op.iLike]: `%${query}%` } }, // Tìm kiếm có dấu trong slug
        ],
      },
      limit,
      offset,
      order: [['tensanpham', 'ASC']],
      include: [
        { model: DanhMuc, attributes: ['tendanhmuc', 'slug'] },
        { model: ThuongHieu, attributes: ['tenthuonghieu'] },
        { model: Promotion, attributes: ['tenchuongtrinh', 'giatrikhuyenmai'] },
        { model: Media, attributes: ['url', 'ismain'], as: 'anhsanpham' }, // Khớp với alias trong response
        {
          model: UnitDetals,
          as: 'chitietdonvi',
          attributes: ['dinhluong', 'giaban'],
          include: [{ model: Unit, attributes: ['donvitinh'] }],
        },
        {
          model: IngredientDetals,
          as: 'chitietthanhphan', // Khớp với alias trong response
          attributes: ['hamluong'],
          include: [{ model: Ingredient, attributes: ['tenthanhphan'] }],
        },
      ],
      raw: false,
      nest: true,
      distinct: true,
    });

    // Kiểm tra nếu offset vượt quá số lượng sản phẩm
    if (offset >= count) {
      return {
        data: [],
        meta: {
          total: count,
          page: currentPage,
          take: limit,
          pageCount: Math.ceil(count / limit),
        },
      };
    }

    const data = rows.map((rawProduct: any) => {
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

    return {
      data,
      meta: {
        total: count,
        page: currentPage,
        take: limit,
        pageCount: Math.ceil(count / limit),
      },
    };
  }
}
