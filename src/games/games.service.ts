import { Injectable } from '@nestjs/common';
import { CellValue, GameState } from '@prisma/client';

import { initialState, winCombinations } from '@/games/config/game.config';
import { PlayersService } from '@/players/players.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class GamesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly playersService: PlayersService,
  ) {}

  public getById(id: string) {
    return this.prismaService.game.findUnique({
      where: { id },
      include: { cells: true, players: { include: { user: true } } },
    });
  }

  public async create(userId: string) {
    const game = await this.prismaService.game.create({
      data: {
        cells: { createMany: { data: initialState } },
        players: { create: { userId, symbol: CellValue.X } },
      },
    });

    return this.getById(game.id);
  }

  public async join(gameId: string, userId: string) {
    const player = await this.playersService.create({
      gameId,
      userId,
      symbol: CellValue.O,
    });

    this.prismaService.game.update({
      where: { id: gameId },
      data: { turn: player.id, state: GameState.IN_PROGRESS },
    });

    return this.getById(gameId);
  }

  public async makeTurn(gameId: string, playerId: string, cellId: string) {
    // const currentPlayer = await this.playersService.getById(playerId);
    // const players = await this.playersService.getByGameId(gameId);
    //
    // const nextPlayer = players.find((p) => p.id !== playerId);
    //
    // await this.prismaService.cell.update({
    //   where: { id: cellId },
    //   data: { value: currentPlayer.symbol },
    // });
    //
    // await this.prismaService.game.update({
    //   where: { id: gameId },
    //   data: { turn: nextPlayer.id },
    // });

    return this.getById(gameId);
  }

  public async getState(
    id: string,
  ): Promise<{ state: GameState; winner?: string }> {
    const game = await this.prismaService.game.findUnique({
      where: { id },
      include: { cells: true, players: true },
    });

    for (const combination of winCombinations) {
      const cells = game.cells.filter(({ row, col }) =>
        combination.find((cell) => cell[0] === col && cell[1] === row),
      );

      const values = [...new Set(cells.map(({ value }) => value))];

      if (values.length === 1) {
        const symbol = values[0];

        // const winner = game.players.find((p) => p.symbol === symbol);

        return { state: GameState.FINISHED };
      }
    }

    return { state: GameState.IN_PROGRESS };
  }
}
