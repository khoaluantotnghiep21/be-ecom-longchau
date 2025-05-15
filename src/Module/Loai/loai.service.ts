import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { randomInt } from 'crypto';
import { Loai } from './loai.entity';
import { CreateLoaiDto } from './dto/createLoai.dto';

@Injectable()
export class LoaiService {
  constructor(
    @InjectModel(Loai)
    private readonly loaiRepo: Repository<Loai>,
  ) {}

  async findAll(): Promise<Loai[]> {
    return await this.loaiRepo.findAll();
  }

  async findOne(maloai: string): Promise<Loai> {
    const loai = await this.loaiRepo.findOne({ where: { maloai } });
    if (!loai) {
      throw new Error('Loại không tồn tại');
    }
    return loai;
  }

  async createLoai(createLoaiDto: CreateLoaiDto): Promise<Loai> {
    const maloai = 'L' + randomInt(1000000, 9999999).toString();
    const data = { ...createLoaiDto, maloai };
    return await this.loaiRepo.create(data);
  }

  async updateLoai(
    maloai: string,
    updateLoaiDto: CreateLoaiDto,
  ): Promise<Loai> {
    const loai = await this.loaiRepo.findOne({ where: { maloai } });
    if (!loai) {
      throw new Error('Loại không tồn tại');
    }
    loai.set(updateLoaiDto);
    return await loai.save();
  }

  async deleteLoai(maloai: string) {
    const loai = await this.loaiRepo.findOne({ where: { maloai } });
    if (!loai) {
      throw new Error('Loại không tồn tại');
    }
    return await loai.destroy();
  }
}
