import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { DataSource, Repository } from 'typeorm';
import { WishAlreadyExistsException } from 'src/exceptions/wish-exist.exception';

@Injectable()
export class WishesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}
  
  async create(createWishDto: CreateWishDto, ownerId: number): Promise<Wish> {
    const wish = await this.wishesRepository.create({
      ...createWishDto,
      owner: {id: ownerId},
    });
    return await this.wishesRepository.save(wish);
  }

  async findAll(): Promise<Wish[]> {
    return this.wishesRepository.find({
      relations: {
        owner: true,
        wishlists: true,
        offers: true
      },
    });
  }

  // Get 40 last wishes
  async getLastWishes(): Promise<Wish[]> {
    const result = await this.wishesRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });

    return result;
  }

  // Get 20 top wishes
  async getTopWishes(): Promise<Wish[]> {
    const result = await this.wishesRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 20,
    });

    return result;
  }

  // Get a wish by id
  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
        wishlists: true
      },
    });

    if (!wish) throw new NotFoundException('There is no wish with such id!');
    return wish;
  }

  // Edit a wish
  async update(userId: number, wishId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.wishesRepository.findOne({ 
      where:{
        id: wishId
      },
      relations: {
        owner: true,
        offers: true
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
      } 
    });

    if (!await this.verifyOwner(userId, wishId)) {
      throw new ForbiddenException('You are not allowed to edit other user\'s wishes!');
    };

    if (!wish) throw new NotFoundException('There is no wish with such id!');
    if (wish.offers.length !== 0) throw new ForbiddenException('Someone has already funded this wish!');

    return await this.wishesRepository.update(wishId, updateWishDto);
  }

  async remove(userId: number, id: number) {
    const wish = await this.wishesRepository.findOneBy({ id });

    if (!wish) throw new NotFoundException('There is no wish with such id!');
    if (!await this.verifyOwner(userId, id)) {
      throw new ForbiddenException('You are not allowed to remove other user\'s wishes!');
    }

    return await this.wishesRepository.delete(id);
  }

  async verifyOwner(userId: number, wishId: number): Promise<boolean> {
    const wish = await this.wishesRepository.findOne({
      where: {
        id: wishId,
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
        offers: true,
      }
    })

    return wish.owner.id === userId;
  }
  
  async copyWish(userId: number, wishId: number) {
    const wish = await this.wishesRepository.findOne({ 
      where: { id: wishId },
      relations: {
        owner: {
          wishes: true,
        }
      } 
    });

    const wishExists = await this.wishesRepository.findOne({
      where: {
        owner: {
          id: userId,
          wishes: {
            name: wish.name,
          }
        },
        
      },
    });

    if (wishExists) throw new WishAlreadyExistsException();

    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    wish.copied++;

    const { name, link, image, price, description } = wish;

    const newWish = { 
      name, 
      link, 
      image, 
      price, 
      description, 
      owner: {id: userId} 
    };

    try {
      await this.wishesRepository.save(wish);
      await this.wishesRepository.create(newWish);
      await this.wishesRepository.save(newWish);

      await queryRunner.commitTransaction();
      return newWish;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err.detail;
    } finally {
      await queryRunner.release();
    }
  }
};
