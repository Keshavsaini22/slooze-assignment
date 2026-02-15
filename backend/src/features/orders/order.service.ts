import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../infrastructure/repositories/order.repository';
import { MenuItemRepository } from '../../infrastructure/repositories/menu-item.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private menuItemRepository: MenuItemRepository,
  ) {}

  async updateStatus(orderId: string, status: OrderStatus) {
    return this.orderRepository.update(orderId, { status });
  }

  async placeOrder(
    orderId: string,
    address: string,
    paymentMethod: string = 'CASH',
  ) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new Error('Order not found');

    return this.orderRepository.update(orderId, {
      status: OrderStatus.CONFIRMED,
      address: address,
      payment: {
        create: {
          method: paymentMethod as PaymentMethod,
          status: PaymentStatus.PENDING,
          amount: order.totalAmount,
        },
      },
    });
  }

  async cancelOrder(orderId: string) {
    return this.orderRepository.update(orderId, {
      status: OrderStatus.CANCELLED,
    });
  }

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { restaurantId, items } = createOrderDto;

    const menuItems = await this.menuItemRepository.findByIds(
      items.map((i) => i.menuItemId),
    );

    let totalAmount = 0;
    const orderItemsData = items.map((item) => {
      const menuItem = menuItems.find((m) => m.id === item.menuItemId);
      if (!menuItem) throw new Error(`Menu item ${item.menuItemId} not found`);
      const price = menuItem.price;
      totalAmount += price * item.quantity;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: price,
      };
    });

    return this.orderRepository.create({
      user: { connect: { id: userId } },
      restaurant: { connect: { id: restaurantId } },
      totalAmount,
      status: OrderStatus.PENDING,
      items: {
        create: orderItemsData,
      },
    });
  }

  async findAll(user: any, country?: string) {
    let filter: any = {};

    if (user.role === 'MEMBER') {
      filter = { userId: user.id };
    } else if (user.role === 'MANAGER') {
      filter = {
        restaurant: {
          country: user.country,
        },
      };
    }
    if (user.role === 'ADMIN' && country) {
      filter = {
        restaurant: {
          country: country,
        },
      };
    }

    return this.orderRepository.findAll(filter, country);
  }

  async findById(id: string) {
    return this.orderRepository.findById(id);
  }
}
