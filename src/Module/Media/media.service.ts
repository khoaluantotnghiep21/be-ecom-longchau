import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse } from 'cloudinary';
import { Media } from './media.entity';
import { SanPham } from '../SanPham/product.entity';
import { UUID } from 'crypto';

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
      }))
    );
  
    return createdMedias;
  }

  async findAll(): Promise<Media[]> {
    return this.mediaModel.findAll();
  }

  async findByProductId(masanpham: string): Promise<Media[]> {
    return this.mediaModel.findAll({ where: { masanpham } });
  }
}
