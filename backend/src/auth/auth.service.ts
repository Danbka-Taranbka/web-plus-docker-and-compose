import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

  auth(user: User) {
    const access_token = this.jwtService.sign(
      { sub: user.id },
      {
        expiresIn: '1d',
      },
    );
    return {access_token: access_token};
  }

  async validatePassword(username: string, pass: string) {
    const user = await this.usersService.findByUsername(username);

    if (user) {
      const isMatched = await this.hashService.verify(pass, user.password);
      const { password, ...result } = user;

      return isMatched ? result : null;
    }

    return null;
  }
}
