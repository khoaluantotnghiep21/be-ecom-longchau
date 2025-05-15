import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IngredientDetals } from "./ingredientDetals.entity";
import { Repository } from "sequelize-typescript";
import { IngredientDetailsDto } from "./dto/ingredientDetalsDto.dto";
import { SanPham } from "../SanPham/product.entity";
import { Ingredient } from "../ThanhPhan/ingredient.entity";
import { UpdateIngredientDetailsDto } from "./dto/updateingredientDetailsDto.dto";

@Injectable()
export class IngredientDetalsService{
    constructor(
        @InjectModel(IngredientDetals)
        private readonly ingredientDetalsRepo: Repository<IngredientDetals>,
        @InjectModel(SanPham)
        private readonly productRepo: Repository<SanPham>,
        @InjectModel(Ingredient)
        private readonly ingredientRepo: Repository<Ingredient>
    ){}

    async addIngredientDetalsForProduct(masanpham: string, madonvitinh: string, ingredientDetailsDto: IngredientDetailsDto): Promise<boolean>{
        const product = await this.productRepo.findOne({where: {masanpham}})
        const ingredient = await this.ingredientRepo.findOne({where: {madonvitinh}})
        if(!product){
            throw new NotAcceptableException('Not found product')
        }
        if(!ingredient){
            throw new NotFoundException('Not found ingredient')
        }
        const data = {masanpham, madonvitinh, ...ingredientDetailsDto}
        await this.ingredientDetalsRepo.create(data)
        return true
    }

    async updateIngredientDetalsForProduct(masanpham: string, madonvitinh: string, updateIngredientDetailsDto: UpdateIngredientDetailsDto): Promise<boolean>{
        
        const ingredientDetals = await this.ingredientDetalsRepo.findOne({where:{masanpham, madonvitinh}})
        if(!ingredientDetals){
            throw new NotAcceptableException('Not found Ingredient Details')
        }
        ingredientDetals.set(updateIngredientDetailsDto)
        await ingredientDetals.save()
        return true;
    }
}