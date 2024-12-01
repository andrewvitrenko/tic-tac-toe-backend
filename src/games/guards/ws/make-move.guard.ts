import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { CellValue, GameState } from '@prisma/client';

import { MakeMoveDto } from '@/games/dto/make-move.dto';
import { GamesService } from '@/games/games.service';
import { TSocket } from '@/games/types/socket.types';
import { PlayersService } from '@/players/players.service';

@Injectable()
export class MakeMoveGuard implements CanActivate {
  constructor(
    private readonly gamesService: GamesService,
    private readonly playersService: PlayersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<TSocket>();
    const data = context.switchToWs().getData<MakeMoveDto>();

    const game = await this.gamesService.getById(data.gameId);
    if (!game) {
      throw new WsException('Game not found');
    }

    if (game.state !== GameState.IN_PROGRESS) {
      throw new WsException('Game is not in progress');
    }

    const player = await this.playersService.getByGameAndUser({
      gameId: data.gameId,
      userId: client.user.id,
    });

    if (!player) {
      throw new WsException('Forbidden');
    }

    if (game.turn !== player.id) {
      throw new WsException('Not your turn');
    }

    const cell = game.cells.find((cell) => cell.id === data.cellId);

    if (!cell) {
      throw new WsException('Cell not found');
    }

    if (cell.value !== CellValue.EMPTY) {
      throw new WsException('Cell is not empty');
    }

    return true;
  }
}
