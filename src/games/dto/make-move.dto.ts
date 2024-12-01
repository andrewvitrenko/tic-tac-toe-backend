import { IsString, IsUUID } from 'class-validator';

export class MakeMoveDto {
  @IsString()
  @IsUUID()
  gameId: string;

  @IsString()
  @IsUUID()
  cellId: string;
}
