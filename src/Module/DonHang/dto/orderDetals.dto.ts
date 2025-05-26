import { ApiProperty } from '@nestjs/swagger';

class OrderDetailItemDto {
    @ApiProperty()
    masanpham: string;

    @ApiProperty()
    soluong: number;

}

export class OrderDetailsDto {
    @ApiProperty()
    phuongthucthanhtoan: string;
    @ApiProperty()
    hinhthucnhanhang: string;
    @ApiProperty()
    mavoucher: string;


    @ApiProperty({ type: [OrderDetailItemDto], description: 'Danh sách chi tiết đơn hàng' })
    details: OrderDetailItemDto[];
}
