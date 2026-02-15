import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MenuItem } from '@prisma/client';

@Injectable()
export class MenuItemRepository {
  constructor(private prisma: PrismaService) {}

  async findByIds(ids: string[]): Promise<MenuItem[]> {
    return this.prisma.menuItem.findMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async findAllByRestaurant(
    restaurantId: string,
    options: {
      page: number;
      limit: number;
      search?: string;
      dietary?: string;
    },
  ): Promise<{ data: MenuItem[]; meta: any }> {
    const { page = 1, limit = 10, search, dietary } = options;
    const skip = (page - 1) * limit;

    const where: any = { restaurantId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (dietary) {
      where.dietaryType =
        dietary === 'VEG' ? 'VEG' : dietary === 'NON_VEG' ? 'NON_VEG' : 'EGG';
    }

    const [total, data] = await Promise.all([
      this.prisma.menuItem.count({ where }),
      this.prisma.menuItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
