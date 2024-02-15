import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Wishlist } from './entities/wishlist.entity';
import { RequestWithUser } from 'src/utils/types';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto, @Req() req): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, req.user.id);
  }

  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Wishlist> {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  update(@Req() req: RequestWithUser, @Param('id') wishlistId: number, @Body() updateWishlistDto: UpdateWishlistDto): Promise<Wishlist> {
    return this.wishlistsService.update(req.user.id, wishlistId, updateWishlistDto);
  }

  @Delete(':id')
  remove(@Req() req: RequestWithUser, @Param('id') id: number) {
    return this.wishlistsService.remove(req.user.id, id);
  }
}
