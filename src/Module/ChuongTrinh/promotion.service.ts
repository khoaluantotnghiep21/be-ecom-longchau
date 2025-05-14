import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Promotion } from "./promotion.entity";
import { Repository } from "sequelize-typescript";
import { PromotionDto } from "./dto/promotion.dto";
import { randomInt } from "crypto";

@Injectable()
export class PromotionService{
    constructor(
        @InjectModel(Promotion)
        private readonly promotionRepo: Repository<Promotion>
    ){}

    async createPromotion(promotionDto:PromotionDto):Promise<Promotion>{
        const machuongtrinh = "CT" + randomInt(10000, 90000)
        if(promotionDto.ngaybatdau > promotionDto.ngayketthuc){
            throw new Error("Error when creating the promotion date")
        }
        const data = {machuongtrinh, ...promotionDto}
        return await this.promotionRepo.create(data)
    }

    
    async updatePromotion(machuongtrinh: string, promotionDto:PromotionDto):Promise<Promotion>{
        const promotion = await this.promotionRepo.findOne({where: {machuongtrinh}})
        if(!promotion){
            throw new NotFoundException("Not found Promotion")
        }
        promotion.set(promotionDto)
        return await promotion.save()
    }

    async deletePromise(machuongtrinh){
        const promotion = await this.promotionRepo.findOne({where: {machuongtrinh}})
        if(!promotion){
            throw new NotFoundException("Not found Promotion")
        }
        return promotion.destroy()
    }

    async getAllPromotion(){
        return await this.promotionRepo.findAll();
    }
}