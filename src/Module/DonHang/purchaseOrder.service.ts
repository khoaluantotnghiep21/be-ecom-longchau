import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { PurchaseOrder } from "./purchaseOrder.entity";
import { Repository, Sequelize } from "sequelize-typescript";
import { UUID } from "crypto";
import { StatusPurchase } from "src/common/Enum/status-purchase.enum";
import { OrderDetail } from '../ChiTietDonHang/orderDetail.entity';
import { OrderDetailsDto } from "./dto/orderDetals.dto";
import { IdentityUser } from "../IdentityUser/identityuser.entity";

@Injectable()
export class PurchaseOrderService {
    constructor(
        @InjectModel(PurchaseOrder)
        private readonly purchaseOrderRepo: Repository<PurchaseOrder>,
        @InjectModel(IdentityUser)
        private readonly userREpo: Repository<IdentityUser>,
        private readonly sequelize: Sequelize,

    ) { }

    async countOrders(): Promise<number> {
        const num = await this.purchaseOrderRepo.findAll();
        return num.length;
    }

    async createNewPurchaseOrder(userid: UUID, trangthai: string, orderDetailDto: OrderDetailsDto): Promise<any> {
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);
        const orderId = (await this.countOrders() + 1).toString().padStart(4, '0');
        const madonhang = `DH${todayStr.replace(/-/g, '')}${orderId}`;
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
            return {
                ...newOrder.toJSON(),
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async updateStatus(madonhang: string, status: StatusPurchase): Promise<PurchaseOrder> {
        const order = await this.purchaseOrderRepo.findOne({ where: { madonhang } });
        if (!order) {
            throw new NotFoundException(`Order with ID ${madonhang} not found`);
        }
        order.set({ trangthai: status });
        return await order.save();

    }
    async getOrderByMadonhang(madonhang: string): Promise<PurchaseOrder> {
        const order = await this.purchaseOrderRepo.findOne({
            where: { madonhang },
        });
        if (!order) {
            throw new NotFoundException(`Order with ID ${madonhang} not found`);
        }
        return order;
    }
    async getOrdersByUserId(userid: UUID): Promise<any[]> {
        const user = await this.userREpo.findOne({ where: { id: userid } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userid} not found`);
        }
        const [results] = await this.sequelize.query(
            `       
           SELECT 
            d.madonhang, 
            i.hoten,
            d.thanhtien,
            d.trangthai,
            json_agg(
                json_build_object(
                'tensanpham', s.tensanpham,
                'donvitinh', ct.donvitinh,
                'soluong', ct.soluong,
                'giaban', ct.giaban,
                'url', a.url
                )
            ) AS sanpham
            FROM identityuser i
            JOIN donhang d ON i.id = d.userid
            JOIN chitietdonhang ct ON d.madonhang = ct.madonhang
            JOIN sanpham s ON ct.masanpham = s.masanpham
            JOIN anhsanpham a ON a.idsanpham = s.id AND a.ismain = true
            WHERE i.id = :userid
            GROUP BY d.madonhang, i.hoten, d.thanhtien, d.trangthai
            `,
            {
                replacements: { userid },
                raw: true,
                plain: false
            }
        );

        return results || [];
    }

    async getAllOrders(): Promise<any[]> {
        const [results] = await this.sequelize.query(
            `
        SELECT 
            d.madonhang, 
            i.hoten,
            d.thanhtien,
            d.trangthai,
            json_agg(
                json_build_object(
                    'tensanpham', s.tensanpham,
                    'donvitinh', ct.donvitinh,
                    'soluong', ct.soluong,
                    'giaban', ct.giaban,
                    'url', a.url
                )
            ) AS sanpham
        FROM identityuser i
        JOIN donhang d ON i.id = d.userid
        JOIN chitietdonhang ct ON d.madonhang = ct.madonhang
        JOIN sanpham s ON ct.masanpham = s.masanpham
        JOIN anhsanpham a ON a.idsanpham = s.id AND a.ismain = true
        GROUP BY d.madonhang, i.hoten, d.thanhtien, d.trangthai
        `,
            {
                raw: true,
                plain: false
            }
        );
        return results || [];
    }
}