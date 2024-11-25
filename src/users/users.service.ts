import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  public getByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  public getById(id: string) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  public getByGameId(gameId: string) {
    return this.prismaService.user.findMany({
      where: { players: { some: { gameId } } },
    });
  }

  public create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({ data: createUserDto });
  }
}
