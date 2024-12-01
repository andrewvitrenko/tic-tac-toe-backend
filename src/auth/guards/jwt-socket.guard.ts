import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JwtSocketGuard extends AuthGuard('jwt-socket') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (err) {
      throw new WsException(err.message);
    }
    return user;
  }
}
