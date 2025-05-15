import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { LoaiService } from './loai.service';
import { Public } from 'src/common/decorator/public.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/Enum/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateLoaiDto } from './dto/createLoai.dto';

@ApiBearerAuth('access-token')
@ApiTags('Loai')
@Controller('loai')
export class LoaiController {
  constructor(private readonly loaiService: LoaiService) {}

  @Public()
  @Get('getLoai')
  async getLoai() {
    const loai = await this.loaiService.findAll();
    return loai;
  }

  @Public()
  @Get('findLoai/:maloai')
  async getLoaiById(@Param('maloai') maloai: string) {
    const loai = await this.loaiService.findOne(maloai);
    return loai;
  }

  @Roles(Role.Admin)
  @Post('createLoai')
  async createLoai(@Body() createLoaiDto: CreateLoaiDto) {
    const newLoai = await this.loaiService.createLoai(createLoaiDto);
    return newLoai;
  }

  @Roles(Role.Admin)
  @Put('updateLoai/:maloai')
  async updateLoai(
    @Param('maloai') maloai: string,
    @Body() updateLoaiDto: CreateLoaiDto,
  ) {
    const updatedLoai = await this.loaiService.updateLoai(
      maloai,
      updateLoaiDto,
    );
    return updatedLoai;
  }

  @Roles(Role.Admin)
  @Delete('deleteLoai/:maloai')
  async deleteLoai(@Param('maloai') maloai: string) {
    const deletedLoai = await this.loaiService.deleteLoai(maloai);
    return deletedLoai;
  }
}
