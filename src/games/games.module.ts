import { Module } from '@nestjs/common';

import { GamesGateway } from '@/games/games.gateway';
import { PlayersModule } from '@/players/players.module';
import { PrismaModule } from '@/prisma/prisma.module';

import { GamesController } from './games.controller';
import { GamesService } from './games.service';

@Module({
  providers: [GamesService, GamesGateway],
  exports: [GamesService],
  imports: [PrismaModule, PlayersModule],
  controllers: [GamesController],
})
export class GamesModule {}
