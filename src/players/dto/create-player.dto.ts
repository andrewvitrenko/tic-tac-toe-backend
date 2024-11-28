import { CellValue } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

export class CreatePlayerDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  gameId: string;

  @IsEnum(CellValue)
  symbol: CellValue;
}
