import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserAlreadyExistsException } from 'src/exceptions/user-exist.exception';
import { Wish } from 'src/wishes/entities/wish.entity';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    private hashService: HashService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...rest } = createUserDto;

      const hash = await this.hashService.hash(password);

      const user = this.usersRepository.create({
        ...createUserDto,
        password: hash,
      });
  
      await this.usersRepository.insert(user);
  
      return user;
    } catch(err) {
      throw new UserAlreadyExistsException();
    }
  };

  async findAll(): Promise<User[]> {
    const result = await this.usersRepository.find();
    return result;
  };

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('There is no user with such id!');

    return user;
  };

  async findMany(query: string): Promise<User[] | undefined> {
    const result = await this.usersRepository.find({
      where: [
        { username: query },
        { email: query }
      ],
    });

    return result;
  };

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ username });

    return user;
  };

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: {email} 
    });

    return user;
  };

  async findUserWishes(username: string): Promise<Wish[]> {
    const result = await this.usersRepository.findOne({
      where: {
        wishes: {
          owner: {
            username: username
          },
        },
      },
      relations: {
        wishes: {
          owner: true,
          offers: true,
        },
      },
    });

    if (!result) {
      return [];
    }

    return result.wishes;
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await this.hashService.hash(updateUserDto.password);
      }
    } catch(err) {
      throw new UnauthorizedException();
    }

    return await this.usersRepository.update(user.id, updateUserDto);
  };

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('There is no user with such id!');

    return await this.usersRepository.delete(id);
  };
}
