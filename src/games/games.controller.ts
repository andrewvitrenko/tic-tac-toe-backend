import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from '@/auth/guards/jwt.guard';
import { GamesGateway } from '@/games/games.gateway';
import { GamesService } from '@/games/games.service';
import { GetGameGuard } from '@/games/guards/http/get-game.guard';
import { JoinGameGuard } from '@/games/guards/http/join-game.guard';
import { EMessageType } from '@/games/types/message.types';

@UseGuards(JwtGuard)
@Controller('games')
export class GamesController {
  constructor(
    private readonly gamesService: GamesService,
    private readonly gamesGateway: GamesGateway,
  ) {}

  @Post('/new')
  create(@Request() req) {
    return this.gamesService.create(req.user.id);
  }

  @UseGuards(JoinGameGuard)
  @Post('/join/:id')
  async join(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    const game = await this.gamesService.join(id, req.user.id);
    this.gamesGateway.manualUpdate(id, EMessageType.JOIN_GAME, game);

    return game;
  }

  @UseGuards(GetGameGuard)
  @Get('/:id')
  getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.gamesService.getById(id);
  }
}
