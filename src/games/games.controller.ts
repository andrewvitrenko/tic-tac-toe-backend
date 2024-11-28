import {
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UseJwtGuard } from '@/auth/guards/jwt.guard';
import { GamesService } from '@/games/games.service';
import { JoinGameGuard } from '@/games/guards/join-game.guard';

@UseJwtGuard()
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('/new')
  create(@Request() req) {
    return this.gamesService.create(req.user.id);
  }

  @UseGuards(JoinGameGuard)
  @Post('/join/:id')
  join(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.gamesService.join(id, req.user.id);
  }
}
