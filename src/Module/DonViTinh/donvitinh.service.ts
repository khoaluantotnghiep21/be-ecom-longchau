import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Unit } from "./donvitinh.entity";
import { Repository } from "sequelize-typescript";
import { DonViTinhDto } from "./dto/donvitinh.dto";
import { randomInt } from "crypto";

@Injectable()
export class UnitService{
    constructor(
        @InjectModel(Unit)
        private readonly dvtRepo: Repository<Unit>
    ){}

    async createNewDonViTinh(dvtDto: DonViTinhDto): Promise<Unit>{
        const madonvitinh = "DVT0" + randomInt(100, 99999);
        const data  = {madonvitinh,... dvtDto}
        return await this.dvtRepo.create(data)
    }

    async findAllDonViTinh(){
        return await this.dvtRepo.findAll();
    }

    async updateUnit(madonvitinh: string, unitDto: DonViTinhDto): Promise<Unit>{
        const unit = await this.dvtRepo.findOne({where: {madonvitinh}})
        if(!unit){
            throw new NotFoundException("Not found Unit")
        }
        unit.set(unitDto)
        return await unit.save()
    }
}