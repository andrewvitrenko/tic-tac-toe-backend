import { Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';

import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { omit } from '@/utils/omit';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  public getByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  public async getById(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    return omit(user, ['password']);
  }

  public getByGameId(gameId: string) {
    return this.prismaService.user.findMany({
      where: { players: { some: { gameId } } },
    });
  }

  public getByName(name: string) {
    return this.prismaService.user.findUnique({ where: { name } });
  }

  public async create({ password, ...data }: CreateUserDto) {
    const user = await this.prismaService.user.create({
      data: {
        ...data,
        password: await hash(password, await genSalt()),
      },
    });
    return omit(user, ['password']);
  }
}
