import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { RepositoryModule } from '../../infrastructure/repositories/repository.module';

@Module({
  imports: [DatabaseModule, RepositoryModule],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
