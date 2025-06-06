import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Promotion } from "./promotion.entity";
import { PromotionService } from "./promotion.service";
import { AuthGuard } from "src/guards/auth.guards";
import { PromotionController } from "./promotion.controller";
import { SanPham } from "../SanPham/product.entity";

@Module({
    imports:[SequelizeModule.forFeature([Promotion, SanPham])],
    providers:[PromotionService, AuthGuard],
    controllers:[PromotionController],
    exports:[AuthGuard]
})

export class PromotionModule{}