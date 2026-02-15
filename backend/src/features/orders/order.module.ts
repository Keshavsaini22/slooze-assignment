import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { RepositoryModule } from '../../infrastructure/repositories/repository.module';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, RepositoryModule, AuthModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
