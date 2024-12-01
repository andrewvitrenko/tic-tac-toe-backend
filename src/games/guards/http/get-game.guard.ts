import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';

import { GamesService } from '@/games/games.service';

@Injectable()
export class GetGameGuard implements CanActivate {
  constructor(private readonly gamesService: GamesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const gameId = request.params.id;

    if (!isUUID(gameId)) {
      throw new BadRequestException('Invalid game id');
    }

    const game = await this.gamesService.getById(gameId);

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return true;
  }
}
