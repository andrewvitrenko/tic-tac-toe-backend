import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreatePlayerDto } from './dto/create-player.dto';
import { GetByGameAndUserDto } from './dto/get-by-game-and-user.dto';

@Injectable()
export class PlayersService {
  constructor(private readonly prismaService: PrismaService) {}

  public create({ gameId, symbol, userId }: CreatePlayerDto) {
    return this.prismaService.player.create({
      data: { gameId, userId, symbol },
    });
  }

  public getByGameAndUser(getByGameAndUserDto: GetByGameAndUserDto) {
    return this.prismaService.player.findUnique({
      where: { gameId_userId: getByGameAndUserDto },
    });
  }
}
