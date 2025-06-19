import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { PurchaseOrder } from "./purchaseOrder.entity";
import { Repository, Sequelize } from "sequelize-typescript";
import { UUID } from "crypto";
import { StatusPurchase } from "src/common/Enum/status-purchase.enum";
import { OrderDetail } from '../ChiTietDonHang/orderDetail.entity';
import { OrderDetailsDto } from "./dto/orderDetals.dto";
import { IdentityUser } from "../IdentityUser/identityuser.entity";
import { Voucher } from "../Voucher/voucher.entity";
import { Op } from "sequelize";

@Injectable()
export class PurchaseOrderService {
    constructor(
        @InjectModel(PurchaseOrder)
        private readonly purchaseOrderRepo: Repository<PurchaseOrder>,

        @InjectModel(Voucher)
        private readonly voucherRepo: Repository<Voucher>,
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
        const createdat = new Date();
        try {
            // 1. Thêm đơn hàng trước
            const data = {
                madonhang,
                ngaymuahang: todayStr,
                userid,
                trangthai,
                ...orderDetailDto,
                createdat,
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
            d.ngaymuahang,
            i.hoten,
            d.thanhtien,
            d.trangthai,
            d.createdat,
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
            GROUP BY d.madonhang, i.hoten, d.thanhtien, d.trangthai, d.ngaymuahang, d.createdat
            ORDER BY d.createdat DESC
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
            d.ngaymuahang,
            i.hoten,
            d.thanhtien,
            d.trangthai,
            d.createdat,
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
        GROUP BY d.madonhang, i.hoten, d.thanhtien, d.trangthai, d.ngaymuahang, d.createdat
        ORDER BY d.createdat DESC
        `,
            {
                raw: true,
                plain: false
            }
        );
        return results || [];
    }

    async getOrderDetailsByMadonhang(madonhang: string): Promise<any> {
        const order = await this.purchaseOrderRepo.findOne({ where: { madonhang } });
        if (!order) {
            throw new NotFoundException(`Order with ID ${madonhang} not found`);
        }

        const [results] = await this.sequelize.query(
            `       
           SELECT 
            d.madonhang, 
            i.hoten,
            g.diachinguoinhan,
            d.machinhanh,
            g.thoigiannhan,
            g.nguoinhan,
            g.sodienthoainguoinhan,
            g.thoigiandukien,
            i.sodienthoai,
            i.diachi,
            d.thanhtien, d.ngaymuahang, 
            d.tongtien, d.giamgiatructiep, 
            d.phivanchuyen, d.phuongthucthanhtoan, 
            d.mavoucher, d.hinhthucnhanhang,
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
            LEFT JOIN giaohang g ON g.madonhang = d.madonhang
            JOIN sanpham s ON ct.masanpham = s.masanpham
            JOIN anhsanpham a ON a.idsanpham = s.id AND a.ismain = true
            WHERE d.madonhang = :madonhang
            GROUP BY d.madonhang,d.machinhanh,g.diachinguoinhan,g.thoigiannhan, g.thoigiandukien , g.nguoinhan, g.sodienthoainguoinhan,i.hoten, i.sodienthoai, i.diachi, d.thanhtien, d.trangthai, d.ngaymuahang, d.tongtien, d.giamgiatructiep, d.phivanchuyen, d.phuongthucthanhtoan, d.mavoucher, d.hinhthucnhanhang
            `,
            {
                replacements: { madonhang },
                raw: true,
                plain: false
            }
        );

        return results;
    }

    async getOrderDetailsByMaChiNhanh(machinhanh: string): Promise<any> {
        const order = await this.purchaseOrderRepo.findOne({ where: { machinhanh } });
        if (!order) {
            throw new NotFoundException(`Order with ID ${machinhanh} not found`);
        }

        const [results] = await this.sequelize.query(
            `       
           SELECT 
            d.madonhang, 
            i.hoten as nguoiban,
            d.machinhanh,
            d.ngaymuahang,
            d.thanhtien, d.ngaymuahang, d.tongtien, d.giamgiatructiep, d.phivanchuyen, d.phuongthucthanhtoan, d.mavoucher, d.hinhthucnhanhang,
            t.sodienthoai as sodienthoainguoinhan,
            t.hoten as nguoinhan,
            t.ghichu,
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
            LEFT JOIN giaohang g ON g.madonhang = d.madonhang
            JOIN sanpham s ON ct.masanpham = s.masanpham
            JOIN anhsanpham a ON a.idsanpham = s.id AND a.ismain = true
            JOIN donthuoctuvan t ON t.madonhang = d.madonhang
            WHERE d.machinhanh = :machinhanh
            GROUP BY d.madonhang,d.machinhanh,g.diachinguoinhan,g.thoigiannhan,g.nguoinhan, g.sodienthoainguoinhan,i.hoten, i.sodienthoai, i.diachi, d.thanhtien, d.trangthai, d.ngaymuahang, d.tongtien, d.giamgiatructiep, d.phivanchuyen, d.phuongthucthanhtoan, d.mavoucher, d.hinhthucnhanhang, t.sodienthoai, t.hoten, t.ghichu
            `,
            {
                replacements: { machinhanh },
                raw: true,
                plain: false
            }
        );

        return results;
    }

    async getOrdersByVoucher(mavoucher: string): Promise<PurchaseOrder[]> {
        console.log('Received mavoucher:', mavoucher);
        if (!mavoucher) {
            throw new NotFoundException('Voucher code is required');
        }


        const voucher = await this.voucherRepo.findOne({
            where: { mavoucher: { [Op.iLike]: mavoucher } },
        });
        console.log('Voucher found:', voucher?.toJSON() || 'null');
        if (!voucher) {
            throw new NotFoundException(`Voucher with code ${mavoucher} not found`);
        }


        const orders = await this.purchaseOrderRepo.findAll({
            where: { mavoucher: { [Op.iLike]: mavoucher } },
        });
        console.log('Orders found:', orders.map(order => order.toJSON()));

        return orders;
    }

    async getRevenueStats(type: 'day' | 'week' | 'month'): Promise<any> {
        let groupBy = '';
        if (type === 'day') groupBy = "DATE(ngaymuahang)";
        else if (type === 'week') groupBy = "EXTRACT(WEEK FROM ngaymuahang)";
        else if (type === 'month') groupBy = "EXTRACT(MONTH FROM ngaymuahang)";

        const [result] = await this.sequelize.query(
            `
    SELECT ${groupBy} as period, SUM(thanhtien) as total_revenue, COUNT(*) as total_orders
    FROM donhang
    WHERE trangthai = 'Đã xác nhận'
    GROUP BY period
    ORDER BY period DESC
    `
        );
        return result;
    }
}


