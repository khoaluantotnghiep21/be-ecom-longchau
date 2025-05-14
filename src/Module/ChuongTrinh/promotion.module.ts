import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Promotion } from "./promotion.entity";
import { PromotionService } from "./promotion.service";
import { AuthGuard } from "src/guards/auth.guards";
import { PromotionController } from "./promotion.controller";

@Module({
    imports:[SequelizeModule.forFeature([Promotion])],
    providers:[PromotionService, AuthGuard],
    controllers:[PromotionController],
    exports:[AuthGuard]
})

export class PromotionModule{}