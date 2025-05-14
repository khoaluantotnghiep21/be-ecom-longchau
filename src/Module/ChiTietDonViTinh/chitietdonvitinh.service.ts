import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Repository } from "sequelize-typescript";
import { UnitDetalsDto } from "./dto/chitietdonvitinh.dto";
import { SanPham } from "../SanPham/product.entity";
import { Unit } from "../DonViTinh/donvitinh.entity";
import { UnitDetals } from "./chitietdonvitinh.entity";
import { UpdateUnitDetalsDto } from "./dto/updatechitietdonvitinh.dto";

@Injectable()
export class UnitDetalsSerive{
    constructor(
        @InjectModel(UnitDetals)
        private readonly unitDetalsRepo: Repository<UnitDetals>,
        @InjectModel(SanPham)
        private readonly productRepo: Repository<SanPham>,
        @InjectModel(Unit)
        private readonly unitRepo: Repository<Unit>

    ){}

    async addProductWithUnit(unitDetalsDto: UnitDetalsDto): Promise<UnitDetals> {
        const { masanpham, madonvitinh } = unitDetalsDto;
    
        if (!await this.productRepo.findOne({ where: { masanpham } })) {
            throw new NotFoundException("Not found Product");
        }
    
        if (!await this.unitRepo.findOne({ where: { madonvitinh } })) {
            throw new NotFoundException("Not found Unit");
        }
    
        const data = { ...unitDetalsDto };
        return await this.unitDetalsRepo.create(data);
    }
    
    async updateProductWithUnit(masanpham:string, madonvitinh: string, updtaeUnitDetalsDto: UpdateUnitDetalsDto): Promise<UnitDetals>{
        const product = await this.productRepo.findOne({where :{masanpham}})
        if(!product){
            throw new NotFoundException("Not found Product")
        }
        if (!await this.unitRepo.findOne({ where: { madonvitinh: updtaeUnitDetalsDto.madonvitinh } })) {
            throw new NotFoundException("Not found Unit");
        }
        const unitDetails = await this.unitDetalsRepo.findOne({where:{masanpham, madonvitinh}})
        if(!unitDetails)
        {
            throw new NotFoundException("Product have not this unit")
        }
        unitDetails.set(updtaeUnitDetalsDto)
        const UpdateUnitDetals = await unitDetails.save()
        return UpdateUnitDetals
    }
}