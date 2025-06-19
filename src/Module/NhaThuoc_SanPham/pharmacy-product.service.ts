import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NhaThuoc_SanPham } from './pharmacy-product.entity';
import { SanPham } from '../SanPham/product.entity';
import { CapNhatTonKhoDto, PharmacyProductDto, StatusDto, UpdatePharmacyProductDto } from './dto/pharmacy-product.dto';
import { IdentityUser } from '../IdentityUser/identityuser.entity';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { MultiProductsDto, ProductQuantityDto } from './dto/multi-products.dto';
import { SimpleProductInputDto } from './dto/simple-product-input.dto';
import { UnitDetals } from '../ChiTietDonViTinh/chitietdonvitinh.entity';
import { Unit } from '../DonViTinh/donvitinh.entity';



@Injectable()
export class PharmacyProductService {
  constructor(
    @InjectModel(NhaThuoc_SanPham)
    private readonly pharmacyProductModel: typeof NhaThuoc_SanPham,
    @InjectModel(SanPham)
    private readonly productModel: typeof SanPham,
    @InjectModel(IdentityUser)
    private readonly userModel: typeof IdentityUser,
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Thêm sản phẩm vào nhà thuốc
   * @param pharmacyProductDto Thông tin sản phẩm nhà thuốc
   * @param userid ID của người dùng đang đăng nhập
   * @returns Thông tin sản phẩm nhà thuốc đã tạo
   * @deprecated Sử dụng createBatchPharmacyProducts thay thế
   */
  async createPharmacyProduct(pharmacyProductDto: PharmacyProductDto, userid: string): Promise<NhaThuoc_SanPham> {
    // Kiểm tra sản phẩm tồn tại
    const product = await this.productModel.findOne({
      where: { masanpham: pharmacyProductDto.masanpham },
    });
    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với mã ${pharmacyProductDto.masanpham}`);
    }

    // Kiểm tra xem sản phẩm đã có trong nhà thuốc chưa
    const existingProduct = await this.pharmacyProductModel.findOne({
      where: {
        machinhanh: pharmacyProductDto.machinhanh,
        masanpham: pharmacyProductDto.masanpham,
      },
    });

    if (existingProduct) {
      // Nếu đã tồn tại, cập nhật số lượng
      existingProduct.soluong += pharmacyProductDto.soluong;
      await existingProduct.save();
      return existingProduct;
    }

    // Tạo mới thông tin sản phẩm nhà thuốc
    return await this.pharmacyProductModel.create({
      ...pharmacyProductDto,
      manhaphang: this.generateImportCode(),
      userid,
      ngaygui: new Date(),
      tinhtrang: 'Chưa duyệt', 
    });
  }

  /**
   * Lấy thông tin sản phẩm nhà thuốc theo ID
   * @param id ID của thông tin sản phẩm nhà thuốc
   * @returns Thông tin sản phẩm nhà thuốc
   */
  async getPharmacyProductById(machinhanh: string): Promise<any[]> {
    const result = await this.sequelize.query(
      `
      SELECT 
      nsp.manhaphang,
      nsp.ngaygui,
      nsp.tinhtrang,
      u.hoten AS nguoi_gui,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'machinhanh', nsp.machinhanh,
          'masanpham', nsp.masanpham,
          'soluong', nsp.soluong,
          'tensanpham', sp.tensanpham
        )
      ) AS danhsach_sanpham
      FROM nhathuoc_sanpham nsp
      where nsp.machinhanh = :machinhanh
      JOIN sanpham sp ON nsp.masanpham = sp.masanpham
      JOIN identityuser u ON nsp.userid = u.id
      GROUP BY nsp.manhaphang, nsp.ngaygui, nsp.tinhtrang, u.hoten
      ORDER BY nsp.ngaygui DESC;
          `
      ,
      {
        replacements: { machinhanh },
        type: QueryTypes.SELECT,
      }
    );
    
    return result;
  }

  /**
   * Lấy tất cả sản phẩm nhà thuốc
   * @returns Danh sách sản phẩm nhà thuốc, có thể được nhóm theo lô
   */
  async getAllPharmacyProducts(): Promise<any[]> {
    const result = await this.sequelize.query(
      `
      SELECT 
      nsp.manhaphang,
      nsp.ngaygui,
      nsp.tinhtrang,
      u.hoten AS nguoi_gui,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'machinhanh', nsp.machinhanh,
          'masanpham', nsp.masanpham,
          'soluong', nsp.soluong,
          'tensanpham', sp.tensanpham
        )
      ) AS danhsach_sanpham
      FROM nhathuoc_sanpham nsp
      where nsp.tinhtrang = 'Đã xác nhận đơn hàng'
      JOIN sanpham sp ON nsp.masanpham = sp.masanpham
      JOIN identityuser u ON nsp.userid = u.id
      GROUP BY nsp.manhaphang, nsp.ngaygui, nsp.tinhtrang, u.hoten
      ORDER BY nsp.ngaygui DESC;
          `
      ,
      {
        type: QueryTypes.SELECT,
      }
    );
    
    return result;
  }

  /**
   * Lấy danh sách sản phẩm của một chi nhánh nhà thuốc
   * @param machinhanh Mã chi nhánh nhà thuốc
   * @returns Danh sách sản phẩm của chi nhánh
   */
  async getProductsByBranch(machinhanh: string): Promise<any> {
    const result = await this.sequelize.query(
      `
      SELECT 
        nsp.*, 
        sp.masanpham, 
        sp.tensanpham,
        u.hoten as nguoicapnhat,
        u.email as email_nguoi_capnhat
      FROM nhathuoc_sanpham nsp
      JOIN sanpham sp ON nsp.masanpham = sp.masanpham
      JOIN identityuser u ON nsp.userid = u.id
      WHERE nsp.machinhanh = :machinhanh
      ORDER BY nsp.ngaygui DESC
      `,
      {
        replacements: { machinhanh },
        type: QueryTypes.SELECT,
      }
    );
    
    return {
      success: true,
      data: result,
      totalProducts: result.length,
      message: `Đã tìm thấy ${result.length} sản phẩm trong chi nhánh ${machinhanh}`
    };
  }

  /**
   * Cập nhật thông tin sản phẩm nhà thuốc
   * @param id ID của thông tin sản phẩm nhà thuốc
   * @param updatePharmacyProductDto Thông tin cập nhật
   * @param userid ID của người dùng đang đăng nhập
   * @returns Thông tin sản phẩm nhà thuốc đã cập nhật
   */
  async updatePharmacyProduct(
    id: string,
    updatePharmacyProductDto: UpdatePharmacyProductDto,
    userid: string,
  ): Promise<NhaThuoc_SanPham> {
    const pharmacyProduct = await this.pharmacyProductModel.findByPk(id);
    if (!pharmacyProduct) {
      throw new NotFoundException(`Không tìm thấy thông tin sản phẩm nhà thuốc với ID ${id}`);
    }

    // Cập nhật thông tin
    await pharmacyProduct.update({
      ...updatePharmacyProductDto,
      userid, // Cập nhật ID người dùng đang thực hiện
      ngaygui: new Date(), // Cập nhật ngày cập nhật
    });

    return pharmacyProduct;
  }

  /**
   * Xóa thông tin sản phẩm nhà thuốc
   * @param id ID của thông tin sản phẩm nhà thuốc
   * @returns Thông báo kết quả
   */
  async deletePharmacyProduct(id: string): Promise<{ success: boolean; message: string }> {
    const pharmacyProduct = await this.pharmacyProductModel.findByPk(id);
    if (!pharmacyProduct) {
      throw new NotFoundException(`Không tìm thấy thông tin sản phẩm nhà thuốc với ID ${id}`);
    }
    
    await pharmacyProduct.destroy();
    
    return {
      success: true,
      message: 'Xóa thông tin sản phẩm nhà thuốc thành công',
    };
  }

  /**
   * Tìm kiếm sản phẩm nhà thuốc
   * @param searchTerm Từ khóa tìm kiếm
   * @returns Danh sách sản phẩm nhà thuốc phù hợp
   */
  async searchPharmacyProducts(searchTerm: string): Promise<any[]> {
    const result = await this.sequelize.query(
      `
      SELECT nsp.*, sp.tensanpham, u.hoten as nguoicapnhat
      FROM nhathuoc_sanpham nsp
      JOIN sanpham sp ON nsp.masanpham = sp.masanpham
      JOIN identityuser u ON nsp.userid = u.id
      WHERE 
        nsp.machinhanh LIKE :search OR
        nsp.masanpham LIKE :search OR
        sp.tensanpham LIKE :search OR
        nsp.tinhtrang LIKE :search
      ORDER BY nsp.ngaygui DESC
      `,
      {
        replacements: { search: `%${searchTerm}%` },
        type: QueryTypes.SELECT,
      }
    );
    
    return result;
  }

  /**
   * Cập nhật tình trạng sản phẩm nhà thuốc
   * @param id ID của thông tin sản phẩm nhà thuốc
   * @param tinhtrang Tình trạng mới
   * @param userid ID của người dùng đang đăng nhập
   * @returns Thông tin sản phẩm nhà thuốc đã cập nhật
   */
async updateProductStatus(manhaphang: string): Promise<NhaThuoc_SanPham[]> {
  const found = await this.pharmacyProductModel.findAll({
    where: { manhaphang },
  });

  if (!found || found.length === 0) {
    throw new NotFoundException(`Không tìm thấy sản phẩm với mã nhập hàng: ${manhaphang}`);
  }

  await this.pharmacyProductModel.update(
    { tinhtrang: 'Đã xác nhận đơn hàng' },
    { where: { manhaphang } }
  );

  // Lấy lại dữ liệu sau khi update để đảm bảo đồng bộ
  const updated = await this.pharmacyProductModel.findAll({
    where: { manhaphang },
  });

  return updated;
}





  /**
   * Thêm nhiều sản phẩm vào nhà thuốc sử dụng danh sách sản phẩm và số lượng
   * @param multiProductsDto Thông tin nhiều sản phẩm nhà thuốc
   * @param userid ID của người dùng đang đăng nhập
   * @returns Kết quả xử lý thêm sản phẩm
   */
  async createMultipleProducts(
    multiProductsDto: MultiProductsDto,
    userid: string
  ): Promise<{
    success: boolean;
    message: string;
    manhaphang: string;
    totalProducts: number;
    createdProducts: number;
    updatedProducts: number;
    failedProducts: number;
    details: {
      created: NhaThuoc_SanPham[];
      updated: NhaThuoc_SanPham[];
      failed: { product: ProductQuantityDto; reason: string }[];
    };
  }> {
    const { machinhanh, products } = multiProductsDto;

    // Tạo một mã nhập hàng duy nhất cho toàn bộ lô
    const batchImportCode = this.generateImportCode();

    // Kết quả thực hiện
    const result = {
      success: true,
      message: '',
      manhaphang: batchImportCode, // Thêm mã nhập hàng vào kết quả
      totalProducts: products.length,
      createdProducts: 0,
      updatedProducts: 0,
      failedProducts: 0,
      details: {
        created: [] as NhaThuoc_SanPham[],
        updated: [] as NhaThuoc_SanPham[],
        failed: [] as { product: ProductQuantityDto; reason: string }[],
      },
    };

    // Danh sách mã sản phẩm để kiểm tra tồn tại
    const productCodes = products.map((p) => p.masanpham?.trim());
    
    // In ra log để debug
    console.log('Tìm kiếm các mã sản phẩm:', JSON.stringify(productCodes));

    // Sử dụng Op.in để tìm kiếm
    const { Op } = require('sequelize');
    const existingProducts = await this.productModel.findAll({
      where: { 
        masanpham: {
          [Op.in]: productCodes
        }
      },
    });

    // In ra số lượng sản phẩm tìm thấy để debug
    console.log(`Tìm thấy ${existingProducts.length} sản phẩm trong database`);
    existingProducts.forEach(product => {
      console.log(`- Mã: '${product.masanpham}', ID: ${product.id}`);
    });

    // Tạo map để tra cứu nhanh
    const productMap = new Map();
    existingProducts.forEach((product) => {
      productMap.set(product.masanpham?.trim(), product);
    });

    // Xử lý từng sản phẩm trong danh sách
    await Promise.all(
      products.map(async (product) => {
        try {
          // Kiểm tra sản phẩm tồn tại
          const trimmedCode = product.masanpham?.trim();
          console.log(`Đang kiểm tra sản phẩm với mã: '${trimmedCode}'`);
          
          let foundProduct = productMap.get(trimmedCode);
          
          if (!foundProduct) {
            console.log(`Không tìm thấy sản phẩm với mã: '${trimmedCode}' trong map, thử tìm trực tiếp...`);
            
            // Thử tìm kiếm trực tiếp từ database một lần nữa
            try {
              // Tìm kiếm chính xác
              foundProduct = await this.productModel.findOne({
                where: { masanpham: trimmedCode }
              });

              // Nếu không tìm thấy, thử tìm bỏ qua chữ hoa/thường
              if (!foundProduct) {
                const { Op } = require('sequelize');
                const allProductsWithSimilarCode = await this.productModel.findAll({
                  where: Sequelize.where(
                    Sequelize.fn('LOWER', Sequelize.col('masanpham')), 
                    Sequelize.fn('LOWER', trimmedCode)
                  )
                });
                
                if (allProductsWithSimilarCode && allProductsWithSimilarCode.length > 0) {
                  foundProduct = allProductsWithSimilarCode[0];
                  console.log(`Tìm thấy sản phẩm với mã tương tự (case insensitive): ${foundProduct.masanpham}`);
                }
              }
            } catch (searchError) {
              console.error(`Lỗi khi tìm kiếm sản phẩm: ${searchError.message}`);
            }
            
            if (foundProduct) {
              console.log(`Tìm thấy sản phẩm qua truy vấn trực tiếp: ${foundProduct.masanpham}, ID: ${foundProduct.id}`);
              productMap.set(trimmedCode, foundProduct);
            } else {
              result.failedProducts++;
              result.details.failed.push({
                product,
                reason: `Không tìm thấy sản phẩm với mã ${trimmedCode}`,
              });
              return;
            }
          }

          // Kiểm tra xem sản phẩm đã có trong nhà thuốc chưa
          const existingPharmacyProduct = await this.pharmacyProductModel.findOne({
            where: {
              machinhanh: machinhanh,
              masanpham: product.masanpham,
            },
          });

          if (existingPharmacyProduct) {
            // Nếu đã tồn tại, cập nhật số lượng
          
            existingPharmacyProduct.set({soluong: existingPharmacyProduct.dataValues.soluong + product.soluong, userid, ngaygui: new Date()} );
            await existingPharmacyProduct.save();
            
            result.updatedProducts++;
            result.details.updated.push(existingPharmacyProduct);
          } else {
            // Tạo mới thông tin sản phẩm nhà thuốc
            const newPharmacyProduct = await this.pharmacyProductModel.create({
              machinhanh: machinhanh,
              masanpham: product.masanpham,
              soluong: product.soluong,
              manhaphang: batchImportCode, // Sử dụng cùng một mã nhập hàng cho toàn bộ lô
              userid,
              ngaygui: new Date(),
              tinhtrang: 'Chưa duyệt',
            });
            
            result.createdProducts++;
            result.details.created.push(newPharmacyProduct);
          }
        } catch (error) {
          result.failedProducts++;
          result.details.failed.push({
            product,
            reason: `Lỗi khi xử lý: ${error.message}`,
          });
        }
      })
    );

    // Tạo thông báo tổng hợp
    result.message = `Đã xử lý ${result.totalProducts} sản phẩm trong lô ${batchImportCode}: ${result.createdProducts} mới, ${result.updatedProducts} cập nhật, ${result.failedProducts} thất bại.`;
    result.success = result.failedProducts < result.totalProducts; // Thành công nếu ít nhất 1 sản phẩm được xử lý
    
    return result;
  }



  /**
   * Kiểm tra sản phẩm có tồn tại trong cơ sở dữ liệu hay không
   * @param masanpham Mã sản phẩm cần kiểm tra
   * @returns Thông tin về sản phẩm tìm thấy
   */
  async checkProduct(masanpham: string): Promise<any> {
    const { Op } = require('sequelize');
    const trimmedCode = masanpham.trim();
    
    // Tìm kiếm chính xác
    const exactMatch = await this.productModel.findOne({
      where: { masanpham: trimmedCode }
    });

    // Tìm kiếm gần đúng
    const similarMatches = await this.productModel.findAll({
      where: { 
        masanpham: {
          [Op.like]: `%${trimmedCode}%` 
        }
      },
      limit: 10
    });

    // Lấy tất cả mã sản phẩm để phân tích
    const allProducts = await this.productModel.findAll({
      attributes: ['masanpham'],
      limit: 20,
      order: [['masanpham', 'ASC']]
    });

    return {
      searchTerm: trimmedCode,
      exactMatch: exactMatch || "Không tìm thấy",
      similarMatches: similarMatches.map(p => ({ id: p.id, masanpham: p.masanpham, tensanpham: p.tensanpham })),
      sampleProducts: allProducts.map(p => p.masanpham)
    };
  }

  /**
   * Kiểm tra chi tiết đơn vị của một danh sách sản phẩm
   * @param masanpham Mảng mã sản phẩm cần kiểm tra
   * @returns Thông tin về chi tiết đơn vị của các sản phẩm
   */
  async checkUnitDetails(masanpham: string[]): Promise<any> {
    const result = {};
    
    for (const msp of masanpham) {
      // Kiểm tra sản phẩm tồn tại
      const product = await this.productModel.findOne({
        where: { masanpham: msp },
        attributes: ['id', 'masanpham', 'tensanpham']
      });
      
      if (!product) {
        result[msp] = { 
          exists: false, 
          message: 'Sản phẩm không tồn tại',
          details: null
        };
        continue;
      }
      
      // Truy vấn trực tiếp bảng chi tiết đơn vị
      const unitDetails = await this.sequelize.query(
        `SELECT ud.*, u.donvitinh 
         FROM chitietdonvi ud 
         JOIN donvitinh u ON ud.madonvitinh = u.madonvitinh 
         WHERE ud.masanpham = :masanpham`,
        {
          replacements: { masanpham: msp },
          type: QueryTypes.SELECT,
        }
      );
      
      result[msp] = {
        exists: true,
        product: {
          id: product.id,
          masanpham: product.masanpham,
          tensanpham: product.tensanpham
        },
        hasUnitDetails: unitDetails.length > 0,
        unitDetailsCount: unitDetails.length,
        unitDetails: unitDetails
      };
    }
    
    return result;
  }

  /**
   * Tạo mã nhập hàng ngẫu nhiên
   * @returns Mã nhập hàng định dạng NH-YYYYMMDD-XXXX
   */
  private generateImportCode(): string {
    // Lấy ngày hiện tại để tạo định dạng YYYYMMDD
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    
    // Tạo số ngẫu nhiên 4 chữ số
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    
    // Tạo mã nhập hàng theo định dạng NH-YYYYMMDD-XXXX
    return `NH-${dateStr}-${randomNum}`;
  }

  async updateTonKho(machinhanh: string, masanpham: string, capNhatTonKho: CapNhatTonKhoDto): Promise<NhaThuoc_SanPham> {
    const product = await this.pharmacyProductModel.findOne({
      where: { machinhanh, masanpham },
    });

    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với mã ${masanpham} trong chi nhánh ${machinhanh}`);
    }
   product.set({soluong: capNhatTonKho.soluongtonkho})
   await product.save();
    return product;
  }
}
