import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePharmacyDto } from './dto/createPharmacy.dto';
import { UpdatePharmacyDto } from './dto/updatePharmacy.dto';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('Pharmacy')
@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Public()
  @Get('getAllPharmacy')
  async findAll() {
    return this.pharmacyService.findAll();
  }

  @Get('findOnePharmacy/:machinhanh')
  async findOne(@Param('machinhanh') machinhanh: string) {
    return this.pharmacyService.findOne(machinhanh);
  }

  @Post('createNewPharmacy')
  async create(@Body() createPharmacyDto: CreatePharmacyDto) {
    return this.pharmacyService.createPharmacity(createPharmacyDto);
  }

  @Put('updatePharmacy/:machinhanh')
  async update(
    @Param('machinhanh') machinhanh: string,
    @Body() updatePharmacyDto: UpdatePharmacyDto,
  ) {
    return this.pharmacyService.updatePharmacity(machinhanh, updatePharmacyDto);
  }

  @Delete('deletePharmacy/:machinhanh')
  async delete(@Param('machinhanh') machinhanh: string) {
    return this.pharmacyService.deletePharmacity(machinhanh);
  }
}
