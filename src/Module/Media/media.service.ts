import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse } from 'cloudinary';
import { Media } from './media.entity';
import { SanPham } from '../SanPham/product.entity';
import { UUID } from 'crypto';
import { Op } from 'sequelize';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media) 
    private readonly mediaModel: typeof Media,
    @InjectModel(SanPham)
    private readonly sanPhamModel: typeof SanPham,
    private readonly configService: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImages(files: Express.Multer.File[], idsanpham: UUID): Promise<Media[]> {
    const productExists = await this.sanPhamModel.findOne({ where: { id: idsanpham } });
    if (!productExists) {
      throw new Error('Sản phẩm không tồn tại');
    }
  
    const uploadPromises = files.map(file => 
      new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'media' }, (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
        }).end(file.buffer);
      })
    );
  
    const uploadResults = await Promise.all(uploadPromises);
  
    const createdMedias = await this.mediaModel.bulkCreate(
      uploadResults.map((result, index) => ({
        idsanpham,
        url: result.secure_url,
        type: files[index].mimetype,
        size: files[index].size,
        ismain: index === 0
      }))
    );
  
    return createdMedias;
  }

  async findAll(): Promise<Media[]> {
    return this.mediaModel.findAll();
  }

  async findByProductId(idsanpham: UUID): Promise<Media[]> {
    return this.mediaModel.findAll({ where: { idsanpham } });
  }
  
  /**
   * Cập nhật URL và các thuộc tính khác của ảnh sản phẩm
   * @param mediaId ID của media cần cập nhật
   * @param file File ảnh mới
   * @returns Media đã được cập nhật
   */
  async updateProductImage(mediaId: string, file: Express.Multer.File): Promise<Media> {
    if (!file) {
      throw new Error('Không tìm thấy file ảnh');
    }
        const media = await this.mediaModel.findOne({ where: { id: mediaId } });
    if (!media) {
      throw new Error('Media không tồn tại');
    }
    
    if (!media.url) {
      console.log(`Cảnh báo: Media ID ${mediaId} không có URL hợp lệ`);
    } else {
      try {
        const urlParts = media.url.split('/');
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const publicId = `media/${filenameWithExtension.split('.')[0]}`;
        
        await new Promise<void>((resolve, reject) => {
          cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) return reject(error);
            resolve();
          });
        });
      } catch (deleteError) {
        console.error(`Lỗi khi xóa ảnh cũ: ${deleteError.message}`);
      }
    }
    
    try {
      const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'media' }, (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
        }).end(file.buffer);
      });

      await this.mediaModel.update(
        {
          url: uploadResult.secure_url,
          type: file.mimetype,
          size: file.size
        },
        { where: { id: mediaId } }
      );
      
      if (media.dataValues.ismain) {
        await this.mediaModel.update(
          { ismain: false },
          { 
            where: { 
              idsanpham: media.dataValues.idsanpham, 
              id: { [Op.ne]: media.dataValues.id } 
            } 
          }
        );
      }
      
      // Tải lại thông tin đã cập nhật
      const updatedMedia = await this.mediaModel.findOne({ where: { id: mediaId } });
      if (!updatedMedia) {
        throw new Error('Không thể tìm thấy media sau khi cập nhật');
      }
      return updatedMedia;
    } catch (error) {
      throw new Error(`Không thể cập nhật ảnh: ${error.message}`);
    }
  }

  /**
   * Xóa ảnh sản phẩm
   * @param mediaId ID của media cần xóa
   * @returns Thông báo kết quả
   */
  async deleteProductImage(mediaId: string): Promise<{ success: boolean; message: string }> {
    // Tìm media cần xóa
    const media = await this.mediaModel.findOne({ where: { id: mediaId } });
    if (!media) {
      throw new Error('Media không tồn tại');
    }

    // Lấy ID của public_id từ URL để xóa ảnh trên Cloudinary
    if (!media.url) {
      console.log(`Cảnh báo: Media ID ${mediaId} không có URL hợp lệ`);
    } else {
      try {
        const urlParts = media.url.split('/');
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const publicId = `media/${filenameWithExtension.split('.')[0]}`;

        // Xóa ảnh trên Cloudinary
        await new Promise<void>((resolve, reject) => {
          cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) return reject(error);
            resolve();
          });
        });
      } catch (deleteError) {
        console.error(`Lỗi khi xóa ảnh trên Cloudinary: ${deleteError.message}`);
        // Tiếp tục thực hiện xóa dữ liệu trong DB dù có lỗi khi xóa ảnh
      }
    }

    try {
      // Nếu đây là ảnh chính, cần đặt một ảnh khác làm ảnh chính
      if (media.ismain) {
        const anotherImage = await this.mediaModel.findOne({ 
          where: { 
            idsanpham: media.idsanpham, 
            id: { [Op.ne]: media.id } 
          } 
        });
        
        if (anotherImage) {
          anotherImage.ismain = true;
          await anotherImage.save();
        }
      }

      // Xóa bản ghi trong database
      await media.destroy();
      
      return { success: true, message: 'Xóa ảnh thành công' };
    } catch (error) {
      throw new Error(`Không thể xóa ảnh: ${error.message}`);
    }
  }
}
