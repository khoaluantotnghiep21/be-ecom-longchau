import { ApiProperty } from '@nestjs/swagger';

class OrderDetailItemDto {
    @ApiProperty()
    masanpham: string;

    @ApiProperty()
    soluong: number;

    @ApiProperty()
    giaban: number;

    @ApiProperty()
    donvitinh: string;
}

export class OrderDetailsDto {
    @ApiProperty()
    phuongthucthanhtoan: string;
    @ApiProperty()
    hinhthucnhanhang: string;
    @ApiProperty()
    mavoucher: string;
    @ApiProperty()
    tongtien: number;
    @ApiProperty()
    giamgiatructiep: number;
    @ApiProperty()
    thanhtien: number;
    @ApiProperty()
    phivanchuyen: number;
    @ApiProperty()
    machinhhanh?: string;
    @ApiProperty({ type: [OrderDetailItemDto], description: 'Danh sách chi tiết đơn hàng' })
    details: OrderDetailItemDto[];
}
