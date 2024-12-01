import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import { JoinGameDto } from '@/games/dto/join-game.dto';
import { TSocket } from '@/games/types/socket.types';
import { PlayersService } from '@/players/players.service';

@Injectable()
export class JoinGameGuard implements CanActivate {
  constructor(private readonly playersService: PlayersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<TSocket>();
    const data = context.switchToWs().getData<JoinGameDto>();

    const player = await this.playersService.getByGameAndUser({
      userId: client.user.id,
      gameId: data.gameId,
    });

    if (!player) {
      throw new WsException('You are not in this game');
    }

    return true;
  }
}
