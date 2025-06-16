import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Put,
  NotFoundException,
  HttpStatus,
  HttpCode,
  Query
} from '@nestjs/common';
import { DonThuocTuVanService } from './donthuoctuvan.service';
import { CreateDonThuocTuVanDto, UpdateDonThuocTuVanDto, DonThuocTuVanResponseDto } from './dto/donthuoctuvan.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { DonThuocTuVan } from './donthuoctuvan.entity';

@ApiTags('DonThuocTuVan')
@ApiBearerAuth('access-token')
@Controller('don-thuoc-tu-van')
export class DonThuocTuVanController {
  constructor(private readonly donThuocTuVanService: DonThuocTuVanService) {}

  @Post('createDonThuocTuVan')
  @ApiOperation({ summary: 'Tạo mới đơn thuốc tư vấn' })
    @Public()
  async create(@Body() createDonThuocTuVanDto: CreateDonThuocTuVanDto): Promise<DonThuocTuVan> {
    return await this.donThuocTuVanService.create(createDonThuocTuVanDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách tất cả đơn thuốc tư vấn' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Danh sách đơn thuốc tư vấn được trả về thành công.',
    type: [DonThuocTuVanResponseDto],
  })
  async findAll(): Promise<DonThuocTuVan[]> {
    return await this.donThuocTuVanService.findAll();
  }

  @Get('by-madonhang')
  @Public()
  @ApiOperation({ summary: 'Lấy đơn thuốc tư vấn theo mã đơn hàng' })

  async findByMaDonHang(@Query('madonhang') madonhang: string): Promise<DonThuocTuVan[]> {
    if (!madonhang) {
      throw new NotFoundException('Mã đơn hàng không được để trống');
    }
    return await this.donThuocTuVanService.findByMaDonHang(madonhang);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Lấy thông tin đơn thuốc tư vấn theo ID' })
  @ApiParam({ name: 'id', description: 'ID của đơn thuốc tư vấn' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đơn thuốc tư vấn được trả về thành công.',
    type: DonThuocTuVanResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy đơn thuốc tư vấn.',
  })
  async findOne(@Param('id') id: string): Promise<DonThuocTuVan> {
    return await this.donThuocTuVanService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin đơn thuốc tư vấn' })
    @Public()
  async update(
    @Param('id') id: string,
    @Body() updateDonThuocTuVanDto: UpdateDonThuocTuVanDto,
  ): Promise<DonThuocTuVan> {
    return await this.donThuocTuVanService.update(id, updateDonThuocTuVanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa đơn thuốc tư vấn' })
  @Public()
  async remove(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    return await this.donThuocTuVanService.remove(id);
  }
}
