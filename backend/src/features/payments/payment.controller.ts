import { Body, Controller, Post, Put, Param, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';

import { PaymentMethod, Role } from '../../domain/entities';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  async checkout(@Body() body: { orderId: string; method: PaymentMethod }) {
    return this.paymentService.processPayment(body.orderId, body.method);
  }

  @Put(':orderId')
  @Roles(Role.ADMIN)
  async updatePaymentMethod(
    @Param('orderId') orderId: string,
    @Body() body: { method: PaymentMethod },
  ) {
    return this.paymentService.updatePaymentMethod(orderId, body.method);
  }
}
