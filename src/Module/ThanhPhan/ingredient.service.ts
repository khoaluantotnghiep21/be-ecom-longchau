import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Ingredient } from "./ingredient.entity";
import { Repository } from "sequelize-typescript";
import { IngredientDto } from "./dto/ingredient.dto";
import { randomInt } from "crypto";

@Injectable()
export class IngredientService{
    constructor(
        @InjectModel(Ingredient)
        private readonly ingredientRepo: Repository<Ingredient>
    ){}

    async getAllIngredient(): Promise<Ingredient[]>{
        return await this.ingredientRepo.findAll()
    }

    async createIngredient(ingredientDto: IngredientDto): Promise<Ingredient>{
        const mathanhphan = 'TP' + randomInt(10000000, 999999999).toString();

        const data = {mathanhphan, ...ingredientDto}
        return await this.ingredientRepo.create(data)
    }

    async updateIngredient(mathanhphan: string, ingredientDto: IngredientDto): Promise<Ingredient>{
        const ingredient = await this.ingredientRepo.findOne({where: {mathanhphan}})
        if(!ingredient){
            throw new NotFoundException('Not found Ingredient');
        }
        ingredient.set(ingredientDto)
        return await ingredient.save()
    }

    async deleteIngredient(mathanhphan: string):Promise<boolean>{
        const ingredient = await this.ingredientRepo.findOne({where: {mathanhphan}})
        if(!ingredient){
            throw new NotFoundException('Not found Ingredient');
        }
        await ingredient.destroy()
        return true;
    }
}