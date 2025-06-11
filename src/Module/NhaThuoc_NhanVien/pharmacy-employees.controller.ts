import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PharmacyEmployeesService } from './pharmacy-employees.service';
import { PharmacyEmployeeDto, RemoveEmployeeDto, GetPharmacyEmployeesDto } from './dto/pharmacy-employee.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/Enum/role.enum';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('PharmacyEmployees')
@Controller('pharmacy-employees')
@ApiBearerAuth('access-token')
export class PharmacyEmployeesController {
  constructor(private readonly pharmacyEmployeesService: PharmacyEmployeesService) {}

  @Post('addEmployee')
  @Public()
  @ApiOperation({ summary: 'Thêm nhân viên vào nhà thuốc' })
  @ApiBody({ type: PharmacyEmployeeDto })
  @ApiResponse({ status: 201, description: 'Thêm nhân viên thành công' })
  @ApiResponse({ status: 400, description: 'Nhân viên đã thuộc nhà thuốc' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhà thuốc hoặc nhân viên' })
  async addEmployeeToPharmacy(@Body() pharmacyEmployeeDto: PharmacyEmployeeDto) {
    return await this.pharmacyEmployeesService.addEmployeeToPharmacy(pharmacyEmployeeDto);
  }

  @Delete('removeEmployee')
  @Public()
  @ApiOperation({ summary: 'Xóa nhân viên khỏi nhà thuốc' })
  @ApiBody({ type: RemoveEmployeeDto })
  @ApiResponse({ status: 200, description: 'Xóa nhân viên thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên trong nhà thuốc' })
  async removeEmployeeFromPharmacy(@Body() removeEmployeeDto: RemoveEmployeeDto) {
    return await this.pharmacyEmployeesService.removeEmployeeFromPharmacy(removeEmployeeDto);
  }

  @Get('getListEmployee/:idnhathuoc')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách nhân viên của nhà thuốc' })
  @ApiParam({ name: 'idnhathuoc', description: 'ID của nhà thuốc' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhà thuốc' })
  async getEmployeesByPharmacy(@Param('idnhathuoc') idnhathuoc: string) {
    return await this.pharmacyEmployeesService.getEmployeesByPharmacy(idnhathuoc);
  }

  @Get('check')
  @Public()
  @ApiOperation({ summary: 'Kiểm tra nhân viên có thuộc nhà thuốc hay không' })
  @ApiResponse({ status: 200, description: 'Kiểm tra thành công' })
  async checkEmployeeInPharmacy(
    @Query('idnhathuoc') idnhathuoc: string,
    @Query('idnhanvien') idnhanvien: string
  ) {
    return await this.pharmacyEmployeesService.checkEmployeeInPharmacy(idnhathuoc, idnhanvien);
  }

  @Get('employee/:idnhanvien')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách nhà thuốc mà nhân viên làm việc' })
  @ApiParam({ name: 'idnhanvien', description: 'ID của nhân viên' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên' })
  async getPharmaciesByEmployee(@Param('idnhanvien') idnhanvien: string) {
    return await this.pharmacyEmployeesService.getPharmaciesByEmployee(idnhanvien);
  }
}
