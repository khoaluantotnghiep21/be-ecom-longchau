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

    async createNewPurchaseOrder(userid: UUID, orderDetailDto: OrderDetailsDto): Promise<PurchaseOrder> {
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10); 
        const orderId = (await this.countOrders() + 1).toString().padStart(4, '0');
        const madonhang = `DH${todayStr.replace(/-/g, '')}${orderId}`;
        const trangthai = StatusPurchase.Pending;
        const data = { madonhang, ngaymuahang: todayStr, userid , trangthai};
        //const product = await this.productRepo.findOne({ where: { masanpham: orderDetailDto.details.map(item => item.masanpham) } });
        for(const item of orderDetailDto.details) {
            const [products] = await this.sequelize.query
            (`
                select s.id, s.masanpham, d.donvitinh, ct.giaban, ct.dinhluong, c.giatrikhuyenmai
                from sanpham s, donvitinh d, chitietdonvi ct, chuongtrinhkhuyenmai c 
                where d.madonvitinh = ct.madonvitinh and s.machuongtrinh = c.machuongtrinh and ct.masanpham = s.masanpham  and s.masanpham = '${item.masanpham}'
            `)
        }
        return this.purchaseOrderRepo.create(data);
        //return await OrderDetail.bulkCreate(orderDetails);
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