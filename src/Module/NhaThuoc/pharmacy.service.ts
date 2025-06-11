import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Pharmacy } from './pharmacy.entity';
import { CreatePharmacyDto } from './dto/createPharmacy.dto';
import { UpdatePharmacyDto } from './dto/updatePharmacy.dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectModel(Pharmacy)
    private readonly pharmacyModel: typeof Pharmacy,
    private readonly sequelize: Sequelize,
  ) {}

    async findAll(): Promise<any[]> {
        const pharmacies = await this.pharmacyModel.findAll();
        const result = pharmacies.map((pharmacy: Pharmacy) => ({
            ...pharmacy.toJSON(),
            diachi: [
                pharmacy.dataValues.diachicuthe,
                pharmacy.dataValues.tenduong,
                pharmacy.dataValues.phuong,
                pharmacy.dataValues.quan,
                pharmacy.dataValues.thanhpho
            ].filter(Boolean).join(', ')
        }));
        return result;
    }

    async createPharmacity(createPharmacityDto: CreatePharmacyDto): Promise<Pharmacy> {
        const machinhanh = 'CN' + Math.floor(Math.random() * 90000000).toString();
        const data = { machinhanh, ...createPharmacityDto };
        const pharmacy = await this.pharmacyModel.create(data);
        return pharmacy;
    }
    async findOne(machinhanh: string): Promise<Pharmacy> {
            const pharmacy = await this.pharmacyModel.findOne({ where: { machinhanh } });
            if (!pharmacy) {
            throw new Error('Pharmacy not found');
            }
            return pharmacy;
    }

    async updatePharmacity(machinhanh: string, updatePharmacityDto: UpdatePharmacyDto): Promise<Pharmacy> {
            const pharmacy = await this.pharmacyModel.findOne({ where: { machinhanh } });
        if (!pharmacy) {
        throw new Error('Pharmacy not found');
        }
        pharmacy.set(updatePharmacityDto);
        return await pharmacy.save();
    }
    async deletePharmacity(machinhanh: string): Promise<boolean> {
        const pharmacy = await this.pharmacyModel.findOne({ where: { machinhanh } });
        if (!pharmacy) {
        throw new Error('Pharmacy not found');
        }
        await pharmacy.destroy();
        return true;
    }
    
    async findPharmacyByProvinces(provinces: string, district: string): Promise<any[]> {
        const data = await this.sequelize.query(
            `SELECT * FROM nhathuoc WHERE thanhpho LIKE :provinces AND quan LIKE :district`,
            {
                replacements: { provinces: `%${provinces}%`, district: `%${district}%` },
                model: this.pharmacyModel,
                mapToModel: true,
            }
        );
        const result = data.map((pharmacy: Pharmacy) => ({
            ...pharmacy.toJSON(),
            diachi: [
                pharmacy.dataValues.diachicuthe,
                pharmacy.dataValues.tenduong,
                pharmacy.dataValues.phuong,
                pharmacy.dataValues.quan,
                pharmacy.dataValues.thanhpho
            ].filter(Boolean).join(', ')
        }));
        return result;
    }

    
}
