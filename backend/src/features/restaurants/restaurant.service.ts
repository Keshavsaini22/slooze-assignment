import { Injectable } from '@nestjs/common';
import { RestaurantRepository } from '../../infrastructure/repositories/restaurant.repository';
import { MenuItemRepository } from '../../infrastructure/repositories/menu-item.repository';

@Injectable()
export class RestaurantService {
  constructor(
    private restaurantRepository: RestaurantRepository,
    private menuItemRepository: MenuItemRepository,
  ) {}

  async findAll(
    options: { page: number; limit: number; search?: string; dietary?: string },
    user?: any,
  ) {
    if (user && user.role !== 'ADMIN') {
      return this.restaurantRepository.findAll({
        ...options,
        country: user.country,
      });
    }
    return this.restaurantRepository.findAll(options);
  }

  async findOne(id: string) {
    return this.restaurantRepository.findById(id);
  }

  async getMenu(
    restaurantId: string,
    options: {
      page: number;
      limit: number;
      search?: string;
      dietary?: string;
    },
  ) {
    return this.menuItemRepository.findAllByRestaurant(restaurantId, options);
  }
}
