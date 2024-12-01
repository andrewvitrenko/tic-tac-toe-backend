import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { isUUID } from 'class-validator';

import { GamesService } from '@/games/games.service';
import { PlayersService } from '@/players/players.service';

@Injectable()
export class JoinGameGuard implements CanActivate {
  constructor(
    private readonly gamesService: GamesService,
    private readonly playersService: PlayersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const gameId = request.params.id;
    const userId = request.user.id;

    if (!isUUID(gameId)) {
      throw new BadRequestException('Game id should be a valid uuid');
    }

    const game = await this.gamesService.getById(gameId);
    const player = await this.playersService.getByGameAndUser({
      gameId,
      userId,
    });

    if (player) {
      throw new BadRequestException('You are already in this game');
    }

    if (game.players.length > 1) {
      throw new BadRequestException('Game is already full');
    }

    return true;
  }
}
