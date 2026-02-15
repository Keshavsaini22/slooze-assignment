import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { RepositoryModule } from '../../infrastructure/repositories/repository.module';

@Module({
  imports: [DatabaseModule, RepositoryModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
