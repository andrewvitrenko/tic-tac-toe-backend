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
      include: {
        cells: true,
        winner: true,
        players: { include: { user: true } },
      },
    });
  }

  public async create(userId: string) {
    const game = await this.prismaService.game.create({
      data: { cells: { createMany: { data: initialState } } },
    });

    const player = await this.playersService.create({
      symbol: CellValue.X,
      userId,
      gameId: game.id,
    });

    await this.prismaService.game.update({
      where: { id: game.id },
      data: { turn: player.id },
    });

    return this.getById(game.id);
  }

  public async join(gameId: string, userId: string) {
    await this.prismaService.game.update({
      where: { id: gameId },
      data: {
        state: GameState.IN_PROGRESS,
        players: { create: { userId, symbol: CellValue.O } },
      },
    });

    return this.getById(gameId);
  }

  public async makeMove(gameId: string, userId: string, cellId: string) {
    const currentPlayer = await this.playersService.getByGameAndUser({
      gameId,
      userId,
    });
    const players = await this.playersService.getByGame(gameId);

    const nextPlayer = players.find((p) => p.id !== currentPlayer.id);

    await this.prismaService.cell.update({
      where: { id: cellId },
      data: { value: currentPlayer.symbol },
    });

    await this.prismaService.game.update({
      where: { id: gameId },
      data: { turn: nextPlayer.id },
    });

    return this.getById(gameId);
  }

  public async updateState(gameId: string, userId: string) {
    const game = await this.prismaService.game.findUnique({
      where: { id: gameId },
      include: { cells: true, players: true },
    });

    // if players have filled all the cells and no one has won
    if (game.cells.every(({ value }) => value !== CellValue.EMPTY)) {
      await this.prismaService.game.update({
        where: { id: gameId },
        data: { state: GameState.FINISHED },
      });

      return this.getById(gameId);
    }

    const player = await this.playersService.getByGameAndUser({
      gameId,
      userId,
    });

    for (const combination of winCombinations) {
      const cells = game.cells.filter(({ row, col }) =>
        combination.find((cell) => cell[0] === col && cell[1] === row),
      );

      const isWinner = cells.every(({ value }) => value === player.symbol);

      if (isWinner) {
        await this.prismaService.game.update({
          where: { id: gameId },
          data: {
            state: GameState.FINISHED,
            winner: { connect: { id: userId } },
          },
        });

        break;
      }
    }

    return this.getById(gameId);
  }
}
