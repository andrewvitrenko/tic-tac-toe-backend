import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TTokenPayload } from '@/auth/types/token.types';
import { UsersService } from '@/users/users.service';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate({ userId }: TTokenPayload) {
    const user = await this.usersService.getById(userId);

    if (!user) {
      throw new ForbiddenException();
    }

    return user;
  }
}
