import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { UsersService } from '@/users/users.service';
import { omit } from '@/utils/omit';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public login(userId: string) {
    return this.generateToken(userId);
  }

  public async validateUser(email: string, password: string) {
    const user = await this.usersService.getByEmail(email);

    if (user && (await compare(password, user.password))) {
      return omit(user, ['password']);
    }

    return null;
  }

  public async signUp(signUpDto: SignUpDto) {
    const emailUser = await this.usersService.getByEmail(signUpDto.email);

    if (emailUser) {
      throw new ConflictException('Email already exists');
    }

    const nameUser = await this.usersService.getByName(signUpDto.name);

    if (nameUser) {
      throw new ConflictException('Name already exists');
    }

    const user = await this.usersService.create(signUpDto);
    return this.generateToken(user.id);
  }

  private generateToken(userId: string) {
    const access_token = this.jwtService.sign({ userId });
    return { access_token };
  }
}
