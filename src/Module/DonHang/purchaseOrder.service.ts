import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { PurchaseOrder } from "./purchaseOrder.entity";
import { Repository, Sequelize } from "sequelize-typescript";
import { UUID } from "crypto";
import { StatusPurchase } from "src/common/Enum/status-purchase.enum";
import { OrderDetail } from '../ChiTietDonHang/orderDetail.entity';
import { OrderDetailsDto } from "./dto/orderDetals.dto";
import { SanPham } from "../SanPham/product.entity";

@Injectable()
export class PurchaseOrderService {
    constructor(
        @InjectModel(PurchaseOrder)
        private readonly purchaseOrderRepo: Repository<PurchaseOrder>,
        @InjectModel(SanPham)
        private readonly productRepo: Repository<SanPham>,
        private sequelize: Sequelize,
    ) {}

    async countOrders(): Promise<number> {
        const num = await this.purchaseOrderRepo.findAll();
        return num.length;
    }

    async createNewPurchaseOrder(userid: UUID, orderDetailDto: OrderDetailsDto): Promise<any> {
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);
        const orderId = (await this.countOrders() + 1).toString().padStart(4, '0');
        const madonhang = `DH${todayStr.replace(/-/g, '')}${orderId}`;
        const trangthai = StatusPurchase.Pending;
        const t = await this.sequelize.transaction();
        try {
            // 1. Thêm đơn hàng trước
            const data = {
                madonhang,
                ngaymuahang: todayStr,
                userid,
                trangthai,
                ...orderDetailDto,
            };
            const newOrder = await this.purchaseOrderRepo.create(data, { transaction: t });

            // 2. Thêm chi tiết đơn hàng sau khi đơn hàng đã tồn tại
            const orderDetails = orderDetailDto.details.map((item) => ({
                madonhang,
                masanpham: item.masanpham,
                soluong: item.soluong,
                giaban: item.giaban,
                donvitinh: item.donvitinh,
            }));
            await OrderDetail.bulkCreate(orderDetails, { transaction: t });

            await t.commit();
            return newOrder;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async addOrderDetails(orderDetailDto: OrderDetailsDto) {
    const orderResults: Array<any> = [];
    for (const item of orderDetailDto.details) {
        const [products] = await this.sequelize.query(
            `
            select s.id, s.masanpham, d.donvitinh, ct.giaban, ct.dinhluong, c.giatrikhuyenmai
            from sanpham s, donvitinh d, chitietdonvi ct, chuongtrinhkhuyenmai c 
            where d.madonvitinh = ct.madonvitinh 
              and s.machuongtrinh = c.machuongtrinh 
              and ct.masanpham = s.masanpham  
              and s.masanpham = :masanpham
            `,
            { replacements: { masanpham: item.masanpham } }
        );

        // Trường hợp mã sản phẩm không tồn tại
        if (!products || products.length === 0) continue;

        // Nếu có nhiều đơn vị tính, xử lý từng đơn vị
        for (const product of products) {
            const typedProduct = product as {
                giaban: string | number;
                giatrikhuyenmai: string | number;
                [key: string]: any;
            };
            // Loại bỏ dấu phẩy trong giá bán nếu có, và chuyển sang số
            const giaban = parseInt(typeof typedProduct.giaban ) 
            const giatrikhuyenmai = parseInt(typeof typedProduct.giatrikhuyenmai)
            
            // Tính giá cuối cùng
            const giacuoicung = giaban - (giaban * giatrikhuyenmai / 100);
            orderResults.push({
                ...typedProduct,
                giacuoicung
            });
        }
    }
    return orderResults;
}
}