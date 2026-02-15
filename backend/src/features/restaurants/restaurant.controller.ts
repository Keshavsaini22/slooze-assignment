import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../domain/entities';

@Controller('restaurants')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  async findAll(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('dietary') dietary?: string,
  ) {
    return this.restaurantService.findAll(
      {
        page: Number(page),
        limit: Number(limit),
        search,
        dietary,
      },
      req.user,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(id);
  }

  @Get(':id/menu')
  async getMenu(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('dietary') dietary?: string,
  ) {
    return this.restaurantService.getMenu(id, {
      page: Number(page),
      limit: Number(limit),
      search,
      dietary,
    });
  }
}
