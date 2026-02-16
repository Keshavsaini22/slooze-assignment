import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AddCartItemDto } from './dto/add-cart-item.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user);
  }

  @Post('items')
  addItem(@Request() req, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(req.user, dto);
  }

  @Delete('items/:menuItemId')
  removeItem(@Request() req, @Param('menuItemId') menuItemId: string) {
    return this.cartService.removeItem(req.user, menuItemId);
  }

  @Delete()
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user);
  }
}
