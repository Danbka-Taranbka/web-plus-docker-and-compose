import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RequestWithUser } from 'src/utils/types';
import { Wish } from 'src/wishes/entities/wish.entity';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  findMe(@Req() req: RequestWithUser) {
    const user = req.user;

    //Remove hashed password from response
    delete user.password;

    return user;
  }

  @Patch('me')
  update(@Req() req: RequestWithUser, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user, updateUserDto);
  }

  @Get('me/wishes')
  findMyWishes(@Req() req: RequestWithUser): Promise<Wish[]> {
    return this.usersService.findUserWishes(req.user.username);
  }

  @Post('find')
  findMany(@Body('query') query: string): Promise<User[]> {
    return this.usersService.findMany(query);
  }

  @Get(':username')
  findByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.findByUsername(username);
  }

  @Get(':username/wishes')
  findUserWishes(@Param('username') username: string): Promise<Wish[]> {
    return this.usersService.findUserWishes(username);
  }
}
