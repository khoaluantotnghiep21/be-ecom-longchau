import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { UnitService } from "./donvitinh.service";
import { Public } from "src/common/decorator/public.decorator";
import { DonViTinhDto } from "./dto/donvitinh.dto";
import { Unit } from "./donvitinh.entity";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Unit')
@Controller('Unit')
export class UnitController{
    constructor(
        private readonly UnitService: UnitService,
    ){}

    @Public()
    @Get('getAllUnit')
    async getAllUnit(){
        return await this.UnitService.findAllDonViTinh()
    }

    @Public()
    @Post('createUnit')
    async createUnit(@Body() unitDto: DonViTinhDto):Promise<Unit>{
        return await this.UnitService.createNewDonViTinh(unitDto);
    }

    @Public()
    @Put('updateUnit/:madonvitinh')
    async updateUnit(@Param('madonvitinh') madonvitinh: string, @Body() unitDto:DonViTinhDto):Promise<Unit>{
        return await this.UnitService.updateUnit(madonvitinh, unitDto)
    }
}