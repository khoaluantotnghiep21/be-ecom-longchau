// src/payment/payment.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VNPay } from 'vnpay';

@Injectable()
export class PaymentService {
  private vnpay: VNPay;

  constructor(private configService: ConfigService) {
    this.vnpay = new VNPay({
      tmnCode: this.configService.get<string>('VNPAY_TMN_CODE'),
      secureSecret: this.configService.get<string>('VNPAY_SECURE_SECRET'),
      vnpayHost: this.configService.get<string>('VNPAY_HOST'),
      testMode: true, // Chuyển sang false khi triển khai production
      hashAlgorithm: this.configService.get<string>('VNPAY_HASH_ALGORITHM') as any,
    });
  }

  async createPaymentUrl(order: { amount: number; orderId: string; orderInfo: string; ipAddr: string }) {
    const paymentUrl = await this.vnpay.buildPaymentUrl({
      vnp_Amount: order.amount * 100, // VNPay yêu cầu số tiền nhân 100
      vnp_IpAddr: order.ipAddr,
      vnp_OrderInfo: order.orderInfo,
      vnp_OrderType: '250000', // Loại hàng hóa (có thể tùy chỉnh)
      vnp_TxnRef: order.orderId,
      vnp_ReturnUrl: this.configService.get<string>('VNPAY_RETURN_URL'),
    });

    return paymentUrl;
  }

  async verifyReturnUrl(query: any) {
    return this.vnpay.verifyReturnUrl(query);
  }

  async verifyIpnUrl(query: any) {
    return this.vnpay.verifyIpnUrl(query);
  }
}