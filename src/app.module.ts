import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GamesGateway } from './games/games.gateway';
import { GamesModule } from './games/games.module';
import { PlayersModule } from './players/players.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    GamesModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    PlayersModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService, GamesGateway],
})
export class AppModule {}
