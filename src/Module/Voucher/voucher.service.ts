import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Voucher } from "./voucher.entity";
import { Repository } from "sequelize-typescript";
import { CreateVoucherDto } from "./dto/createVoucher.dto";

@Injectable()
export class VoucherService {
    constructor(
        @InjectModel(Voucher)
        private readonly voucherRepo: Repository<Voucher>,
    ) {}

    async createVoucher(createVoucherDto: CreateVoucherDto): Promise<Voucher> {
        const data ={...createVoucherDto};
        return await this.voucherRepo.create(data);
    }

    async findAll(): Promise<Voucher[]> {
        return this.voucherRepo.findAll();
    }

    async updateVoucher(mavoucher: string, updateVoucherDto: CreateVoucherDto): Promise<Voucher> {
        const voucher = await this.voucherRepo.findByPk(mavoucher);
        if (!voucher) {
            throw new Error('Voucher not found');
        }
        voucher.set(updateVoucherDto);
        return await voucher.save();
    }
    
    async deleteVoucher(mavoucher: string): Promise<boolean> {
        const voucher = await this.voucherRepo.findByPk(mavoucher);
        if (!voucher) {
            throw new Error('Voucher not found');
        }
        await voucher.destroy();
        return true;
    }
}