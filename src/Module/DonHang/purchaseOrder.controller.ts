import { Body, Controller, Post, Param, Req, NotFoundException, HttpException, HttpStatus, Put, Get } from '@nestjs/common';
import { Request } from 'express';
import { PurchaseOrderService } from './purchaseOrder.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { OrderDetailsDto } from './dto/orderDetals.dto';
import { PaymentMethod } from 'src/common/Enum/payment-method.enum';
import { StatusPurchase } from 'src/common/Enum/status-purchase.enum';
import { CreatePaymentDto } from './dto/createPaymen.dto';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import { console } from 'inspector';
import { Public } from 'src/common/decorator/public.decorator';
@ApiBearerAuth('access-token')

@ApiTags('Purchase Order')
@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(
    private readonly purchaseOrderService: PurchaseOrderService,
    private readonly configService: ConfigService
  ) {}

  @Post('createNewPurchaseOrder')
  async createNewPurchaseOrder(@Req() req: Request, @Body() orderDetailsDto: OrderDetailsDto) {
    const userid = req['user']?.sub;
    if (!userid) {
      throw new NotFoundException('User ID not found in request');
    }
    const trangthai = StatusPurchase.Confirmed;
    if(orderDetailsDto.phuongthucthanhtoan === PaymentMethod.BankTransfer){
      const statusPending = StatusPurchase.Pending;
      return this.purchaseOrderService.createNewPurchaseOrder(userid, statusPending, orderDetailsDto);
    }
    return this.purchaseOrderService.createNewPurchaseOrder(userid, trangthai, orderDetailsDto);
  }
    


  @Post('create-payment-url')
  async createPaymentUrl(@Body() payment: CreatePaymentDto, @Req() req: Request) {
    try {
      // Kiểm tra đơn hàng tồn tại
      if (payment?.madonhang) {
        const existingOrder = await this.purchaseOrderService.getOrderByMadonhang(
          payment.madonhang
        );
        
        if (!existingOrder) {
          throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
        }
        console.log(existingOrder.dataValues.trangthai)
        if (existingOrder.dataValues.trangthai !== StatusPurchase.Pending) {
          throw new HttpException(
            'Order is not in pending status', 
            HttpStatus.BAD_REQUEST
          );
        }
      }

      const ipAddr = req.ip || '127.0.0.1'; // Lấy IP thực từ request
      let tmnCode = this.configService.get<string>('VNP_TMN_CODE');
      let secretKey = this.configService.get<string>('VNP_HASH_SECRET');
      let vnpUrl = this.configService.get<string>('VNP_URL');
      let returnUrl = this.configService.get<string>('VNP_RETURN_URL');

      let createDate = dayjs().format('YYYYMMDDHHmmss');
      // Sử dụng madonhang thay vì tạo orderId mới
      let orderId = payment?.madonhang || dayjs().format('DDHHmmss');
      let amount = payment?.amount;

      let orderInfo = JSON.stringify({ madonhang: payment.madonhang });
      let orderType = 'other';
      let locale = 'vn';
      let currCode = 'VND';
      let vnp_Params = {};
      
      vnp_Params['vnp_Version'] = '2.1.0';
      vnp_Params['vnp_Command'] = 'pay';
      vnp_Params['vnp_TmnCode'] = tmnCode;
      vnp_Params['vnp_Locale'] = locale;
      vnp_Params['vnp_CurrCode'] = currCode;
      vnp_Params['vnp_TxnRef'] = orderId;
      vnp_Params['vnp_OrderInfo'] = orderInfo;
      vnp_Params['vnp_OrderType'] = orderType;
      vnp_Params['vnp_Amount'] = amount * 100;
      vnp_Params['vnp_ReturnUrl'] = returnUrl;
      vnp_Params['vnp_IpAddr'] = ipAddr;
      vnp_Params['vnp_CreateDate'] = createDate;

      vnp_Params = this.sortObject(vnp_Params);

      let querystring = require('qs');
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require('crypto');
      let hmac = crypto.createHmac('sha512', secretKey);
      let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
      vnp_Params['vnp_SecureHash'] = signed;
      vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

      return {
        success: true,
        data: {
          url: vnpUrl,
          vnp_TxnRef: orderId,
          amount: amount,
        },
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  @Post('verify-payment')
  async verifyPayment(@Body() payment: any) {
    try {
      console.log('Received payment verification:', payment);

      const secureHash = payment['vnp_SecureHash'];
      const { vnp_SecureHash, ...paymentWithoutHash } = payment;

      const sortedParams = this.sortObject(paymentWithoutHash);
      const secretKey = this.configService.get<string>('VNP_HASH_SECRET');
      const querystring = require('qs');
      const signData = querystring.stringify(sortedParams, { encode: false });

      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha512', secretKey);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      if (secureHash !== signed) {
        return {
          success: false,
          message: 'Invalid signature',
          checked: false,
        };
      }

      const orderInfo = JSON.parse(payment.vnp_OrderInfo);

      
      if (payment.vnp_ResponseCode === '00') {
        await this.purchaseOrderService.updateStatus(
          orderInfo.madonhang,
          StatusPurchase.Confirmed
        );
        return {
          success: true,
          message: 'Payment verified successfully',
          data: {
            transactionRef: payment.vnp_TxnRef,
            amount: payment.vnp_Amount / 100,
          },
        };
      } else {
        await this.purchaseOrderService.updateStatus(
          orderInfo.madonhang,
          StatusPurchase.Cancelled
        );
        return {
          success: false,
          message: 'Payment failed',
          responseCode: payment.vnp_ResponseCode,
        };
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  private sortObject(obj: any) {
    let sorted = {};
    let str: string[] = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }

  @Public()
  @Get('paramUrl/:url')
  getParamUrl(@Param('url') url: string): any {
    const parsedUrl = new URL(url);
    const params = Object.fromEntries(parsedUrl.searchParams.entries());
    return params
  }
}
