import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Order, Prisma } from '@prisma/client';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.OrderCreateInput): Promise<Order> {
    return this.prisma.order.create({
      data,
      include: { items: true },
    });
  }

  async findAll(
    filter: Prisma.OrderWhereInput = {},
    country?: string,
  ): Promise<Order[]> {
    const where: Prisma.OrderWhereInput = { ...filter };
    if (country) {
      where.restaurant = { country };
    }
    return this.prisma.order.findMany({
      where,
      include: { items: true, user: true, restaurant: true, payment: true },
    });
  }

  async findById(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true, user: true, restaurant: true, payment: true },
    });
  }

  async update(id: string, data: Prisma.OrderUpdateInput): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data,
      include: { items: true, user: true, restaurant: true, payment: true },
    });
  }
}
