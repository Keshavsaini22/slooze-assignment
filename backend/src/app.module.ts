import { Module } from '@nestjs/common';

import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './features/auth/auth.module';
import { RestaurantModule } from './features/restaurants/restaurant.module';
import { OrderModule } from './features/orders/order.module';
import { PaymentModule } from './features/payments/payment.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    RestaurantModule,
    OrderModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
