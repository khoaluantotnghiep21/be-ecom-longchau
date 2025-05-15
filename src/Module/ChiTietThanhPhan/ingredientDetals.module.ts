import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { IngredientDetals } from "./ingredientDetals.entity";
import { Ingredient } from "../ThanhPhan/ingredient.entity";
import { SanPham } from "../SanPham/product.entity";
import { IngredientDetalsService } from "./ingredientDetals.service";
import { AuthGuard } from "src/guards/auth.guards";
import { IngredientDetailsController } from "./ingredientDetals.controller";

@Module({
    imports: [SequelizeModule.forFeature([IngredientDetals, Ingredient, SanPham])],
    providers: [IngredientDetalsService, AuthGuard],
    controllers: [IngredientDetailsController],
    exports: [AuthGuard]
})
export class IngredientDetalsModule{}