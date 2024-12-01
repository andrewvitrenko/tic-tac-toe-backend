import { Injectable, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Game, GameState } from '@prisma/client';
import { Server } from 'socket.io';

import { JwtSocketGuard } from '@/auth/guards/jwt-socket.guard';
import { JoinGameDto } from '@/games/dto/join-game.dto';
import { MakeMoveDto } from '@/games/dto/make-move.dto';
import { GamesService } from '@/games/games.service';
import { JoinGameGuard } from '@/games/guards/ws/join-game.guard';
import { MakeMoveGuard } from '@/games/guards/ws/make-move.guard';
import { EMessageType } from '@/games/types/message.types';
import { TSocket } from '@/games/types/socket.types';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (error) => new WsException(error),
  }),
)
@UseGuards(JwtSocketGuard)
@WebSocketGateway({ cors: true, namespace: 'game' })
@Injectable()
export class GamesGateway {
  constructor(private readonly gamesService: GamesService) {}

  @WebSocketServer()
  server: Server;

  @UseGuards(JoinGameGuard)
  @SubscribeMessage(EMessageType.JOIN_GAME)
  joinGame(
    @ConnectedSocket() client: TSocket,
    @MessageBody() { gameId }: JoinGameDto,
  ) {
    client.join(gameId);
  }

  manualUpdate(gameId: string, event: string, game: Game) {
    this.server.to(gameId).emit(event, game);
  }

  @UseGuards(MakeMoveGuard)
  @SubscribeMessage(EMessageType.MAKE_MOVE)
  async makeMove(
    @MessageBody() { gameId, cellId }: MakeMoveDto,
    @ConnectedSocket() client: TSocket,
  ) {
    await this.gamesService.makeMove(gameId, client.user.id, cellId);
    const game = await this.gamesService.updateState(gameId, client.user.id);

    const event =
      game.state === GameState.FINISHED
        ? EMessageType.GAME_OVER
        : EMessageType.MAKE_MOVE;

    this.server.to(gameId).emit(event, game);
    return game;
  }
}
