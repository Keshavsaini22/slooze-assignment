import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Restaurant } from '@prisma/client';

@Injectable()
export class RestaurantRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(options: {
    page: number;
    limit: number;
    search?: string;
    dietary?: string;
    country?: string;
  }): Promise<{ data: Restaurant[]; meta: any }> {
    const { page = 1, limit = 10, search, dietary, country } = options;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
        { cuisine: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (dietary) {
      where.menuItems = {
        some: {
          dietaryType:
            dietary === 'VEG'
              ? 'VEG'
              : dietary === 'NON_VEG'
                ? 'NON_VEG'
                : 'EGG',
        },
      };
    }

    if (country) {
      where.country = country;
    }

    const [total, data] = await Promise.all([
      this.prisma.restaurant.count({ where }),
      this.prisma.restaurant.findMany({
        where,
        skip,
        take: limit,
        include: { menuItems: { take: 3 } },
        orderBy: { createdAt: 'desc' },
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

  async findById(id: string): Promise<Restaurant | null> {
    return this.prisma.restaurant.findUnique({
      where: { id },
      include: { menuItems: true },
    });
  }
}
