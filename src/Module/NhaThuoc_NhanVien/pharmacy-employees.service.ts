import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PharmacyEmployes } from './pharmacy-employees.entity';
import { PharmacyEmployeeDto, RemoveEmployeeDto } from './dto/pharmacy-employee.dto';
import { Pharmacy } from '../NhaThuoc/pharmacy.entity';
import { IdentityUser } from '../IdentityUser/identityuser.entity';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';

@Injectable()
export class PharmacyEmployeesService {
  constructor(
    @InjectModel(PharmacyEmployes)
    private readonly pharmacyEmployeesModel: typeof PharmacyEmployes,
    @InjectModel(Pharmacy)
    private readonly pharmacyModel: typeof Pharmacy,
    @InjectModel(IdentityUser)
    private readonly userModel: typeof IdentityUser,
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Thêm nhân viên vào nhà thuốc
   * @param pharmacyEmployeeDto Thông tin nhân viên và nhà thuốc
   * @returns Thông tin nhân viên đã thêm vào nhà thuốc
   */
  async addEmployeeToPharmacy(pharmacyEmployeeDto: PharmacyEmployeeDto): Promise<PharmacyEmployes> {
    const { idnhathuoc, idnhanvien } = pharmacyEmployeeDto;

    // Kiểm tra nhà thuốc tồn tại
    const pharmacy = await this.pharmacyModel.findByPk(idnhathuoc);
    if (!pharmacy) {
      throw new NotFoundException(`Không tìm thấy nhà thuốc với ID ${idnhathuoc}`);
    }

    // Kiểm tra người dùng tồn tại
    const user = await this.userModel.findByPk(idnhanvien);
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID ${idnhanvien}`);
    }

    // Kiểm tra xem nhân viên đã thuộc nhà thuốc chưa
    const existingRelation = await this.pharmacyEmployeesModel.findOne({
      where: { idnhathuoc, idnhanvien }
    });

    if (existingRelation) {
      throw new BadRequestException(`Nhân viên này đã thuộc nhà thuốc`);
    }

    // Thêm nhân viên vào nhà thuốc
    return await this.pharmacyEmployeesModel.create({
      idnhathuoc,
      idnhanvien
    });
  }

  /**
   * Xóa nhân viên khỏi nhà thuốc
   * @param removeEmployeeDto Thông tin nhân viên và nhà thuốc
   * @returns Thông báo kết quả
   */
  async removeEmployeeFromPharmacy(removeEmployeeDto: RemoveEmployeeDto): Promise<{ success: boolean; message: string }> {
    const { idnhathuoc, idnhanvien } = removeEmployeeDto;

    // Kiểm tra mối quan hệ tồn tại
    const existingRelation = await this.pharmacyEmployeesModel.findOne({
      where: { idnhathuoc, idnhanvien }
    });

    if (!existingRelation) {
      throw new NotFoundException(`Không tìm thấy nhân viên này trong nhà thuốc`);
    }

    // Xóa nhân viên khỏi nhà thuốc
    await existingRelation.destroy();

    return {
      success: true,
      message: 'Đã xóa nhân viên khỏi nhà thuốc thành công'
    };
  }

  /**
   * Lấy danh sách nhân viên của nhà thuốc
   * @param idnhathuoc ID của nhà thuốc
   * @returns Danh sách nhân viên của nhà thuốc
   */
  async getEmployeesByPharmacy(idnhathuoc: string): Promise<any[]> {
    // Kiểm tra nhà thuốc tồn tại
    const pharmacy = await this.pharmacyModel.findByPk(idnhathuoc);
    if (!pharmacy) {
      throw new NotFoundException(`Không tìm thấy nhà thuốc với ID ${idnhathuoc}`);
    }

    // Lấy danh sách nhân viên với thông tin chi tiết
    const employees = await this.sequelize.query(
      `
      SELECT u.id, u.hoten, u.email, u.sodienthoai, u.diachi, u.ngaysinh, u.gioitinh
      FROM nhathuoc_nhanvien ne
      JOIN identityuser u ON ne.idnhanvien = u.id
      WHERE ne.idnhathuoc = :idnhathuoc
      `,
      {
        replacements: { idnhathuoc },
        type: QueryTypes.SELECT
      }
    );

    return employees;
  }

  /**
   * Kiểm tra nhân viên có thuộc nhà thuốc hay không
   * @param idnhathuoc ID của nhà thuốc
   * @param idnhanvien ID của nhân viên
   * @returns Kết quả kiểm tra
   */
  async checkEmployeeInPharmacy(idnhathuoc: string, idnhanvien: string): Promise<{ exists: boolean }> {
    const relation = await this.pharmacyEmployeesModel.findOne({
      where: { idnhathuoc, idnhanvien }
    });

    return {
      exists: !!relation
    };
  }

  /**
   * Lấy danh sách nhà thuốc mà nhân viên làm việc
   * @param idnhanvien ID của nhân viên
   * @returns Danh sách nhà thuốc
   */
  async getPharmaciesByEmployee(idnhanvien: string): Promise<any[]> {
    // Kiểm tra người dùng tồn tại
    const user = await this.userModel.findByPk(idnhanvien);
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID ${idnhanvien}`);
    }

    const pharmacies = await this.sequelize.query(
      `
      SELECT p.machinhanh
      FROM nhathuoc_nhanvien ne
      JOIN nhathuoc p ON ne.idnhathuoc = p.id
      WHERE ne.idnhanvien = :idnhanvien
      `,
      {
        replacements: { idnhanvien },
        type: QueryTypes.SELECT
      }
    );

    return pharmacies;
  }
}
