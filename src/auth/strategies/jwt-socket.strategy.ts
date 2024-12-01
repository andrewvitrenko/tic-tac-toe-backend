import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Socket } from 'socket.io';

import { UsersService } from '@/users/users.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { TTokenPayload } from '@/auth/types/token.types';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JwtSocketStrategy extends PassportStrategy(
  Strategy,
  'jwt-socket',
) {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
      jwtFromRequest: JwtSocketStrategy.JwtFromSocket,
    });
  }

  async validate({ userId }: TTokenPayload) {
    const user = await this.usersService.getById(userId);

    if (!user) {
      throw new ForbiddenException();
    }

    return user;
  }

  private static JwtFromSocket(socket: Socket) {
    const header = socket.handshake.headers.authorization;

    if (!header) {
      throw new WsException('Unauthorized');
    }

    const token = header.split(' ')[1];

    if (!token) {
      throw new WsException('Unauthorized');
    }

    return token;
  }
}
