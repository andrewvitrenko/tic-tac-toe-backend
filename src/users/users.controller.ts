import { Controller, Get, Request, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@/auth/guards/jwt.guard';
import { UsersService } from '@/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('/me')
  getMe(@Request() req) {
    return this.usersService.getById(req.user.id);
  }
}
