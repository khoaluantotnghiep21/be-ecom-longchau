import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Ingredient } from "./ingredient.entity";
import { IngredientService } from "./ingredient.service";
import { AuthGuard } from "src/guards/auth.guards";
import { IngredientController } from "./ingredient.controller";

@Module({
    imports: [SequelizeModule.forFeature([Ingredient])],
    providers: [IngredientService, AuthGuard],
    controllers: [IngredientController],
    exports: [AuthGuard]
})
export class IngredientModule{}