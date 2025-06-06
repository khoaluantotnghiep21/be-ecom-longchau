import { Body, Controller, Param, Post, Put } from "@nestjs/common";
import { UnitDetalsSerive } from "./chitietdonvitinh.service";
import { Public } from "src/common/decorator/public.decorator";
import { UnitDetalsDto } from "./dto/chitietdonvitinh.dto";
import { UnitDetals } from "./chitietdonvitinh.entity";
import { UpdateUnitDetalsDto } from "./dto/updatechitietdonvitinh.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('UnitDetails')
@Controller('unitDetailsController')
export class UnitDetalsController{
    constructor(
        private readonly unitDetalsService: UnitDetalsSerive
    ){}

    @Public()
    @Post('addProductWithUnit')
    async addProductWithUnit(@Body() unitDetalsDto: UnitDetalsDto): Promise<UnitDetals>{
        return await this.unitDetalsService.addProductWithUnit(unitDetalsDto)
    }

    @Public()
    @Put('updateProductWithUnit/:masanpham/:madonvitinh')
    async updateUnitDetals(
        @Param('masanpham') masanpham: string,
        @Param('madonvitinh') madonvitinh: string,
        @Body() updateUnitDetalsDto: UpdateUnitDetalsDto
      ) {
        return this.unitDetalsService.updateProductWithUnit(masanpham, madonvitinh, updateUnitDetalsDto);
      }
}