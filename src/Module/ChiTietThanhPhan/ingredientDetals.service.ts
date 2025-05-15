import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IngredientDetals } from "./ingredientDetals.entity";
import { Repository } from "sequelize-typescript";

@Injectable()
export class IngredientDetalsService{
    constructor(
        @InjectModel(IngredientDetals)
        private readonly ingredientDetalsRepo: Repository<IngredientDetals>
    ){}
}