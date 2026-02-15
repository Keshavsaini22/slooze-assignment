import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PlaceOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../domain/entities';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  async create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.id;
    return this.orderService.create(userId, createOrderDto);
  }

  @Put(':id/place')
  @Roles(Role.ADMIN, Role.MANAGER)
  async placeOrder(
    @Param('id') id: string,
    @Body() placeOrderDto: PlaceOrderDto,
  ) {
    return this.orderService.placeOrder(
      id,
      placeOrderDto.address,
      placeOrderDto.paymentMethod,
    );
  }

  @Put(':id/cancel')
  @Roles(Role.ADMIN, Role.MANAGER)
  async cancelOrder(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findById(id);
  }

  @Get()
  async findAll(@Request() req, @Query('country') country?: string) {
    return this.orderService.findAll(req.user, country);
  }
}
