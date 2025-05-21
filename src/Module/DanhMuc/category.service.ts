import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { randomInt } from 'crypto';
import { DanhMuc } from './category.entity';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { slugify } from 'src/common/Utils/slugify';

@Injectable()
export class DanhMucService {
  constructor(
    @InjectModel(DanhMuc)
    private readonly danhMucRepo: Repository<DanhMuc>,
  ) {}

  async findAll(): Promise<DanhMuc[]> {
    return await this.danhMucRepo.findAll();
  }

  async findOne(madanhmuc: string): Promise<DanhMuc> {
    const category = await this.danhMucRepo.findOne({ where: { madanhmuc } });
    if (!category) {
      throw new Error('Category of Medication not found');
    }
    return category;
  }

  async getDanhMucByLoai(maloai: string): Promise<DanhMuc[]> {
    return await this.danhMucRepo.findAll({ where: { maloai } });
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<DanhMuc> {
    const madanhmuc = 'DM' + randomInt(1000000, 9999999).toString();
    const slug = slugify(createCategoryDto.tendanhmuc);
    const data = { ...createCategoryDto, madanhmuc, soluong: 0, slug };
    return await this.danhMucRepo.create(data);
  }

  async updateCategory(
    madanhmuc: string,
    updateCategoryDto: CreateCategoryDto,
  ): Promise<DanhMuc> {
    const category = await this.danhMucRepo.findOne({ where: { madanhmuc } });
    if (!category) {
      throw new Error('Category of Medication not found');
    }
    const slug = slugify(updateCategoryDto.tendanhmuc);
    category.set({ ...updateCategoryDto, slug });
    return await category.save();
  }

  async deleteCategory(madanhmuc: string) {
    const category = await this.danhMucRepo.findOne({ where: { madanhmuc } });
    if (!category) {
      throw new Error('Category of Medication not found');
    }
    return await category.destroy();
  }
}
