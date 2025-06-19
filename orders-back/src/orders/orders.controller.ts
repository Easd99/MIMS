import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  NotFoundException,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { FilterOrderDto } from './dto/filter-order.dto';
import { ChangeStatusOrderDto } from './dto/change-status-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    createOrderDto.userId = req.user['userId'];
    return this.ordersService.create(createOrderDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Query() query: FilterOrderDto, @Req() req: Request) {
    const filter: FilterOrderDto = {
      userId: req.user['userId'],
      status: query.status,
      fromDate: query.fromDate,
      toDate: query.date,
    };
    return this.ordersService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const order = await this.ordersService.findOne(+id, req.user['userId']);
    if (!order) {
      throw new NotFoundException(`order not found`);
    }
    return order;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: Request,
  ) {
    updateOrderDto.userId = req.user['userId'];
    return this.ordersService.update(+id, updateOrderDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.ordersService.remove(+id, req.user['userId']);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/change-status')
  @HttpCode(200)
  changeStatus(
    @Param('id') id: string,
    @Body() input: ChangeStatusOrderDto,
    @Req() req: Request,
  ) {
    return this.ordersService.update(+id, {
      status: input.status,
      userId: req.user['userId'],
    });
  }
}
