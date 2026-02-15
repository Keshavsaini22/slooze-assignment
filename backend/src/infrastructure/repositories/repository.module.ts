import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserRepository } from './user.repository';
import { RestaurantRepository } from './restaurant.repository';
import { OrderRepository } from './order.repository';
import { MenuItemRepository } from './menu-item.repository';
import { PaymentRepository } from './payment.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    UserRepository,
    RestaurantRepository,
    OrderRepository,
    MenuItemRepository,
    PaymentRepository,
  ],
  exports: [
    UserRepository,
    RestaurantRepository,
    OrderRepository,
    MenuItemRepository,
    PaymentRepository,
  ],
})
export class RepositoryModule {}
