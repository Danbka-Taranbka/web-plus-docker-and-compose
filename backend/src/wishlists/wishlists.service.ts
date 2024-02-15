import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private usersRepository: Repository<User>, 
  ) {}

  async create(createWishlistDto: CreateWishlistDto, id: number): Promise<Wishlist> {
    const { name, image, itemsId } = createWishlistDto;

    const owner = await this.usersRepository.findOne({
      where: {
        id
      },
      relations: {
        wishes: true,
        wishlists: true,
      }
    });

    const wishes = itemsId.map(itemId => owner.wishes.find(item => item.id === itemId));

    const newWishlist = await this.wishlistsRepository.create({
      name,
      image,
      items: wishes,
      owner
    });
    return await this.wishlistsRepository.save(newWishlist);
  }

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistsRepository.find({
      relations: {
        owner: true,
        items: true
      }
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: {
        id
      },
      relations: {
        items: true,
        owner: true,
      }
    });

    if (!wishlist) throw new NotFoundException('There is no such wishlist!');

    return wishlist; 
  }

  async update(userId: number, wishlistId: number, updateWishlistDto: UpdateWishlistDto): Promise<Wishlist> {
    
    if (!await this.verifyOwner(userId, wishlistId)) {
      throw new ForbiddenException('You are not allowed to edit other user\'s wishlists!');
    };

    const { itemsId, description, name } = updateWishlistDto;
    const items = itemsId.map((id) => ({id}));

    await this.wishlistsRepository.save({
      id: wishlistId,
      description,
      name,
      items
    });

    return await this.wishlistsRepository.findOne({
      where: {id: wishlistId},
      relations: {
        owner: true,
        items: true,
      }
    });
  }

  async verifyOwner(userId: number, wishListId: number): Promise<boolean> {
    const wishList = await this.wishlistsRepository.findOne({
      where: {
        id: wishListId,
      },
      select: {
        owner: {          
          id: true,
          username: true,
          about: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        }
      },
      relations: {
        owner: true,
      }
    })

    return wishList.owner.id === userId;
  }

  async remove(userId: number, id: number) {
    const wishList = await this.wishlistsRepository.findOneBy({id});
    if (!wishList) throw new NotFoundException('There is no wishlist with such id!');
    if (!await this.verifyOwner(userId, id)) {
      throw new ForbiddenException('You are not allowed to remove other user\'s wishlists!');
    }

    return await this.wishlistsRepository.delete(id);
  }
}
