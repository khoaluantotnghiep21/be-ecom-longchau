// src/payment/payment.controller.ts
import { Controller, Get, Query, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request } from 'express';

@Controller('payment/vnpay')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get('create')
  async createPayment(@Query('amount') amount: number, @Query('orderId') orderId: string, @Req() req: Request) {
    const orderInfo = `Thanh toan don hang ${orderId}`;
    const ipAddr = req.headers['x-forwarded-for']?.toString() || req.ip || '127.0.0.1';

    const paymentUrl = await this.paymentService.createPaymentUrl({
      amount,
      orderId,
      orderInfo,
      ipAddr,
    });

    return { paymentUrl };
  }

  @Get('return')
  async handleReturn(@Query() query: any) {
    const result = await this.paymentService.verifyReturnUrl(query);
    if (result.isVerified) {
      // Xử lý logic khi thanh toán thành công
      return {
        status: 'success',
        message: result.message,
        orderId: query.vnp_TxnRef,
        amount: query.vnp_Amount / 100,
        transactionNo: query.vnp_TransactionNo,
      };
    } else {
      return {
        status: 'error',
        message: 'Xác minh giao dịch thất bại',
      };
    }
  }

  @Get('ipn')
  async handleIpn(@Query() query: any) {
    const result = await this.paymentService.verifyIpnUrl(query);
    if (result.isVerified) {
      // Xử lý logic lưu giao dịch vào database
      return { RspCode: '00', Message: 'Confirm Success' };
    } else {
      return { RspCode: '97', Message: 'Invalid Signature' };
    }
  }
}