import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Payment, PaymentMethod, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentRepository {
  constructor(private prisma: PrismaService) {}

  async upsert(
    orderId: string,
    data: { method: PaymentMethod; status: PaymentStatus; amount: number },
  ): Promise<Payment> {
    return this.prisma.payment.upsert({
      where: { orderId },
      update: data,
      create: {
        orderId,
        ...data,
      },
    });
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({ where: { orderId } });
  }

  async updateMethod(orderId: string, method: PaymentMethod): Promise<Payment> {
    return this.prisma.payment.update({
      where: { orderId },
      data: { method },
    });
  }
}
