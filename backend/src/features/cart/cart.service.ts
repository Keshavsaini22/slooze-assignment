import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { User, Role } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(user: User) {
    // Check if cart exists, create if not
    let cart = await this.prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            menuItem: {
              include: {
                restaurant: true,
              },
            },
          },
          orderBy: {
            menuItem: {
              restaurantId: 'asc', // Sort by restaurant for grouping logic if needed
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId: user.id },
        include: {
          items: { include: { menuItem: { include: { restaurant: true } } } },
        },
      });
    }

    // Transform response to match frontend expectation (flat list of items with restaurant info)
    return {
      id: cart.id,
      items: cart.items.map((item) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
        image: item.menuItem.image,
        dietaryType: item.menuItem.dietaryType,
        restaurantId: item.menuItem.restaurantId,
        restaurantName: item.menuItem.restaurant.name,
        restaurantCountry: item.menuItem.restaurant.country,
      })),
      totalAmount: cart.items.reduce(
        (sum, item) => sum + item.menuItem.price * item.quantity,
        0,
      ),
    };
  }

  async addItem(user: User, dto: AddCartItemDto) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: dto.menuItemId },
      include: { restaurant: true },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    // Role-based Access Control & Country Check
    // "Manager or Team member from India can't access data or features associated with those in America or vice-versa"
    if (user.role !== Role.ADMIN && user.country) {
      if (menuItem.restaurant.country !== user.country) {
        throw new ForbiddenException(
          `You can only order from restaurants in your country (${user.country})`,
        );
      }
    }

    let cart = await this.prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId: user.id },
        include: { items: true },
      });
    }

    // Check if cart has items from another restaurant
    // If so, we might want to clear it or allow multi-restaurant (User requirement: "if user 1 makes a cart... admin can see it")
    // Usually food apps restrict to one restaurant per order. Let's enforcing single restaurant cart for simplicity and standard flow.
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id },
      include: { menuItem: true },
    });

    if (
      existingItem &&
      existingItem.menuItem.restaurantId !== menuItem.restaurantId
    ) {
      // Different restaurant? Clear previous tokens or throw error?
      // Frontend usually handles confirmation. Here we will REPLACE the cart if from different restaurant, logic similar to frontend
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        menuItemId: dto.menuItemId,
      },
    });

    if (cartItem) {
      return this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity + dto.quantity },
      });
    } else {
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          menuItemId: dto.menuItemId,
          quantity: dto.quantity,
        },
      });
    }
  }

  async removeItem(user: User, menuItemId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId: user.id },
    });
    if (!cart) return;

    // We need to find the cartItem by menuItemId within this cart
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        menuItemId: menuItemId,
      },
    });

    if (cartItem) {
      await this.prisma.cartItem.delete({ where: { id: cartItem.id } });
    }
  }

  async clearCart(user: User) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId: user.id },
    });
    if (cart) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
  }
}
