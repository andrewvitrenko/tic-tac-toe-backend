import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { PlayersService } from './players.service';

@Module({
  providers: [PlayersService],
  exports: [PlayersService],
  imports: [PrismaModule],
})
export class PlayersModule {}
