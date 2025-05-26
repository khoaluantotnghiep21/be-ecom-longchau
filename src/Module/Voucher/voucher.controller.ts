import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { VoucherService } from "./voucher.service";
import { Public } from "src/common/decorator/public.decorator";
import { CreateVoucherDto } from "./dto/createVoucher.dto";
import { UpdateVoucherDto } from "./dto/updateVoucher.dto";
import { ApiTags } from "@nestjs/swagger";
@ApiTags('Voucher')
@Controller('voucher')
export class VoucherController {
    constructor(
         private readonly voucherService: VoucherService,
    ) {}
    @Public()
    @Post('createNewVoucher')
    async createVoucher(@Body() createVoucherDto: CreateVoucherDto) {
        return this.voucherService.createVoucher(createVoucherDto);
    }
    
    @Public()
    @Get('getAllVoucher')
    async findAll() {
        return this.voucherService.findAll();
    }
    
    @Public()
    @Put('updateVoucher/:mavoucher')
    async updateVoucher(@Param('mavoucher') mavoucher: string, @Body() updateVoucherDto: UpdateVoucherDto) {
        return this.voucherService.updateVoucher(mavoucher, updateVoucherDto);
    }
    
    @Public()
    @Delete('deleteVoucher/:mavoucher')
    async deleteVoucher(@Param('mavoucher') mavoucher: string) {
        return this.voucherService.deleteVoucher(mavoucher);
    }
}