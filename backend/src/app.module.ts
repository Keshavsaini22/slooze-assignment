import { Module } from '@nestjs/common';

import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './features/auth/auth.module';
import { RestaurantModule } from './features/restaurants/restaurant.module';
import { OrderModule } from './features/orders/order.module';
import { PaymentModule } from './features/payments/payment.module';
import { CartModule } from './features/cart/cart.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    RestaurantModule,
    OrderModule,
    PaymentModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
