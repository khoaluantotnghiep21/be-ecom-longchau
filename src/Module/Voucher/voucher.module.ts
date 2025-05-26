import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Voucher } from "./voucher.entity";
import { VoucherController } from "./voucher.controller";
import { VoucherService } from "./voucher.service";
import { AuthGuard } from "src/guards/auth.guards";

@Module({
    imports: [SequelizeModule.forFeature([Voucher])], 
    controllers: [VoucherController],
    providers: [VoucherService, AuthGuard],
    exports: [AuthGuard],
})
export class VoucherModule {}