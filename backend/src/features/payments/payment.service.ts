import { Injectable, BadRequestException } from '@nestjs/common';
import { PaymentRepository } from '../../infrastructure/repositories/payment.repository';
import { OrderRepository } from '../../infrastructure/repositories/order.repository';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(
    private paymentRepository: PaymentRepository,
    private orderRepository: OrderRepository,
  ) {}

  async processPayment(orderId: string, method: PaymentMethod) {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const existingPayment = await this.paymentRepository.findByOrderId(orderId);

    if (existingPayment && existingPayment.status === PaymentStatus.SUCCESS) {
      throw new BadRequestException('Order already paid');
    }

    const status = PaymentStatus.SUCCESS;

    return this.paymentRepository.upsert(orderId, {
      method,
      status,
      amount: order.totalAmount,
    });
  }

  async updatePaymentMethod(orderId: string, method: PaymentMethod) {
    const payment = await this.paymentRepository.findByOrderId(orderId);
    if (!payment) {
      const order = await this.orderRepository.findById(orderId);
      if (!order) throw new BadRequestException('Order not found');
      return this.paymentRepository.upsert(orderId, {
        method,
        status: PaymentStatus.PENDING,
        amount: order.totalAmount,
      });
    }
    return this.paymentRepository.updateMethod(orderId, method);
  }
}
