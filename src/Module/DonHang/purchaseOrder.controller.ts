import {
  Body,
  Controller,
  Post,
  Param,
  Req,
  Res,
  Get,
  NotFoundException,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs-extra';

import { PurchaseOrderService } from './purchaseOrder.service';
import { OrderDetailsDto } from './dto/orderDetals.dto';
import { CreatePaymentDto } from './dto/createPaymen.dto';
import { PDFService } from './pdf.service';

import { PaymentMethod } from 'src/common/Enum/payment-method.enum';
import { StatusPurchase } from 'src/common/Enum/status-purchase.enum';
import { Public } from 'src/common/decorator/public.decorator';
import { PurchaseOrder } from './purchaseOrder.entity';

import * as dayjs from 'dayjs';
import { UUID } from 'crypto';
import { UpdateStatusDto } from './dto/updateStatusDto';

@ApiBearerAuth('access-token')

@ApiTags('Purchase Order')
@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(
    private readonly purchaseOrderService: PurchaseOrderService,
    private readonly configService: ConfigService,
    private readonly pdfService: PDFService
  ) { }

  @Post('createNewPurchaseOrder')
  async createNewPurchaseOrder(@Req() req: Request, @Body() orderDetailsDto: OrderDetailsDto) {
    const userid = req['user']?.sub;
    if (!userid) {
      throw new NotFoundException('User ID not found in request');
    }
    const method = orderDetailsDto.phuongthucthanhtoan?.trim();

    console.log(`Payment method: "${method}"`);
    console.log(`PaymentMethod.BankTransfer: "${PaymentMethod.BankTransfer}"`);
    console.log(`PaymentMethod.CashOnDelivery: "${PaymentMethod.CashOnDelivery}"`);

    if (method === 'Chuyển khoản ngân hàng') {
      return this.purchaseOrderService.createNewPurchaseOrder(userid, StatusPurchase.Pending, orderDetailsDto);
    }
    return this.purchaseOrderService.createNewPurchaseOrder(userid, StatusPurchase.Confirmed, orderDetailsDto);

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

  @Public()
  @Get('vnpay-return')
  async handleVnpayReturn(@Req() req: Request, @Res() res: Response) {
    try {
      const queryParams = req.query;

      const secureHash = queryParams['vnp_SecureHash'];
      const { vnp_SecureHash, vnp_SecureHashType, ...restParams } = queryParams;

      const sortedParams = this.sortObject(restParams);
      const secretKey = this.configService.get<string>('VNP_HASH_SECRET');

      const querystring = require('qs');
      const signData = querystring.stringify(sortedParams, { encode: false });

      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha512', secretKey);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      if (secureHash !== signed) {
        return res.redirect(
          ``
        );
      }

      const rawOrderInfo = queryParams['vnp_OrderInfo'];
      if (typeof rawOrderInfo !== 'string') {
        throw new HttpException('Invalid vnp_OrderInfo', HttpStatus.BAD_REQUEST);
      }
      const orderInfo = JSON.parse(rawOrderInfo);

      if (queryParams['vnp_ResponseCode'] === '00') {
        await this.purchaseOrderService.updateStatus(
          orderInfo.madonhang,
          StatusPurchase.Confirmed
        );

      } else {
        await this.purchaseOrderService.updateStatus(
          orderInfo.madonhang,
          StatusPurchase.Cancelled
        );

      }
      // let url = this.configService.get<string>('VNP_RETURN_URL_WEB')
      return res.redirect(
        `http://localhost:3000/order-confirmation?madonhang=${orderInfo.madonhang}`
      );
    } catch (error) {
      console.error('VNPay return error:', error);
      let url = this.configService.get<string>('VNP_RETURN_URL_WEB')
      return res.redirect(
        `http://localhost:3000/order-confirmation?madonhang=null`
      );

    }
  }

  @Get('create-payment-url/web/:madonhang')
  async createPaymentUrlWeb(@Param('madonhang') madonhang: string, @Req() req: Request) {
    try {
      let existingOrder = {} as PurchaseOrder;
      // Kiểm tra đơn hàng tồn tại

      if (madonhang) {
        existingOrder = await this.purchaseOrderService.getOrderByMadonhang(
          madonhang
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
      const ipAddr = req.ip || '127.0.0.1';
      let tmnCode = this.configService.get<string>('VNP_TMN_CODE');
      let secretKey = this.configService.get<string>('VNP_HASH_SECRET');
      let vnpUrl = this.configService.get<string>('VNP_URL');
      const protocol = req.protocol;
      const host = req.get('host');
      const returnUrl = `${protocol}://${host}/purchase-order/vnpay-return`;

      let createDate = dayjs().format('YYYYMMDDHHmmss');
      // Sử dụng madonhang thay vì tạo orderId mới
      let orderId = existingOrder?.dataValues?.madonhang || dayjs().format('DDHHmmss');
      let amount = existingOrder?.dataValues?.thanhtien;

      let orderInfo = JSON.stringify({ madonhang: madonhang });
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

  @Public()
  @Get('getOderByUserId/:userid')
  async getOderByUserId(@Param('userid') userid: UUID) {
    if (!userid) {
      throw new NotFoundException('User ID not found');
    }
    return this.purchaseOrderService.getOrdersByUserId(userid);
  }

  @Public()
  @Get('getOrderByMadonhang/:madonhang')
  async getOrderByMadonhang(@Param('madonhang') madonhang: string) {
    if (!madonhang) {
      throw new NotFoundException('Order ID not found');
    }
    return this.purchaseOrderService.getOrderDetailsByMadonhang(madonhang);
  }

  @Public()
  @Get('getOrderByMaChiNhanh/:machinhanh')
  async getOrderByMaChiNhanh(@Param('machinhanh') machinhanh: string) {
    if (!machinhanh) {
      throw new NotFoundException('Order ID not found');
    }
    return this.purchaseOrderService.getOrderDetailsByMaChiNhanh(machinhanh);
  }

  @Public()
  @Get('getAllOrders')
  async getAllOrders() {
    return this.purchaseOrderService.getAllOrders();
  }

  @Put('updateStatus/:madonhang')
  @ApiBody({ type: UpdateStatusDto })
  async updateOrderStatus(
    @Param('madonhang') madonhang: string,
    @Body() body: UpdateStatusDto
  ) {
    if (!madonhang || !body.status) {
      throw new HttpException('Order ID or status is missing', HttpStatus.BAD_REQUEST);
    }
    return this.purchaseOrderService.updateStatus(madonhang, body.status);
  }

  @Public()
  @Get('generate-invoice/:madonhang')
  async generateInvoice(
    @Param('madonhang') madonhang: string,
    @Res() res: Response
  ) {
    try {
      // Get order details using the existing method
      const orderDetails = await this.purchaseOrderService.getOrderDetailsByMadonhang(madonhang);

      if (!orderDetails || orderDetails.length === 0) {
        throw new NotFoundException(`Order with ID ${madonhang} not found`);
      }

      // Extract the first result as our order data
      const orderData = orderDetails[0];

      // Generate the PDF invoice
      const pdfFilePath = await this.pdfService.generateInvoice(orderData);

      // Set appropriate headers for file download
      const filename = `invoice_${madonhang}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      // Stream the file as response
      const fileStream = fs.createReadStream(pdfFilePath);
      fileStream.pipe(res);

      // Clean up the temporary file after sending
      fileStream.on('end', () => {
        fs.unlink(pdfFilePath, (err) => {
          if (err) console.error('Error deleting temporary PDF file:', err);
        });
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw new HttpException(
        error.message ?? 'Error generating invoice',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('getOrdersByVoucher/:mavoucher')
  async getOrdersByVoucher(@Param('mavoucher') mavoucher: string) {
    return this.purchaseOrderService.getOrdersByVoucher(mavoucher);
  }

  @Public()
  @Get('stats/revenue/:type')
  async getRevenueStats(@Param('type') type: 'day' | 'week' | 'month') {
    return this.purchaseOrderService.getRevenueStats(type);
  }
}
