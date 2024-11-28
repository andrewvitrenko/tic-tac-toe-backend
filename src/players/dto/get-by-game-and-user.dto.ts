import { IsUUID } from 'class-validator';

export class GetByGameAndUserDto {
  @IsUUID()
  gameId: string;

  @IsUUID()
  userId: string;
}
