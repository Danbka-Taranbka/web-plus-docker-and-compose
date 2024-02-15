import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { RequestWithUser } from 'src/utils/types';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Wish } from './entities/wish.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req): Promise<Wish> {
    return this.wishesService.create(createWishDto, +req.user.id);
  }

  @Get()
  findAll(): Promise<Wish[]> {
    return this.wishesService.findAll();
  }

  // Get 40 last wishes
  @Get('last')
  getLastWishes(): Promise<Wish[]> {
    return this.wishesService.getLastWishes();
  }

  // Get 20 top wishes
  @Get('top')
  getTopWishes(): Promise<Wish[]> {
    return this.wishesService.getTopWishes();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Wish> {
    return this.wishesService.findOne(id);
  }

  // Edit a wish
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Req() req: RequestWithUser, @Param('id') wishId: number, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(req.user.id, wishId, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Req() req: RequestWithUser, @Param('id') id: number) {
    return this.wishesService.remove(req.user.id, id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@Param('id') id: number, @Req() req: RequestWithUser): Promise<Wish> {
    return this.wishesService.copyWish(req.user.id, +id);
  }
}
