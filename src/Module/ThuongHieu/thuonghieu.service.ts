import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ThuongHieu } from "./thuonghieu.entity";
import { Repository } from "sequelize-typescript";
import { CreateBrandDto } from "./dto/createBrand.dto";
import { randomInt } from "crypto";
import { UpdateBrandDto } from "./dto/updateBrand.dto";

@Injectable()
export class ThuongHieuService {
   constructor(
       @InjectModel(ThuongHieu) 
       private readonly brandRepo: Repository<ThuongHieu>,
     ) {}

    async findAll(): Promise<ThuongHieu[]> {
        return await this.brandRepo.findAll();
   }

    async findOne(mathuonghieu: string): Promise<ThuongHieu> {
        const thuonghieu = await this.brandRepo.findOne({ where: { mathuonghieu } });
        if (!thuonghieu) {
            throw new Error('Brand not found');
        }
        return thuonghieu;
    }

    async createBrand(createBrandDto: CreateBrandDto) : Promise<ThuongHieu> {
        const mathuonghieu = 'TH' + randomInt(100000, 999999).toString();
        const data = { ...createBrandDto, mathuonghieu}
        return await this.brandRepo.create(data);
    }

    async updateBrand(mathuonghieu: string, updateBrandDto: UpdateBrandDto) : Promise<ThuongHieu>{
        const thuonghieu = await this.brandRepo.findOne({ where: { mathuonghieu } });
        if (!thuonghieu) {
            throw new Error('Brand not found');
        }
        thuonghieu.set(updateBrandDto);
        return await thuonghieu.save();
    }

    async deleteBrand(mathuonghieu: string) {
        const thuonghieu = await this.brandRepo.findOne({ where: { mathuonghieu } });
        if (!thuonghieu) {
            throw new Error('Brand not found');
        }
        return await thuonghieu.destroy();
    }
}