import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { isUUID } from 'class-validator';

import { GamesService } from '@/games/games.service';

@Injectable()
export class JoinGameGuard implements CanActivate {
  constructor(private readonly gamesService: GamesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const gameId = request.params.id;
    const userId = request.user.id;

    if (!isUUID(gameId)) {
      throw new BadRequestException('Game id should be a valid uuid');
    }

    const game = await this.gamesService.getById(gameId);

    if (game.players.find(({ user: { id } }) => id === userId)) {
      throw new BadRequestException('You are already in this game');
    }

    if (game.players.length > 1) {
      throw new BadRequestException('Game is already full');
    }

    return true;
  }
}
