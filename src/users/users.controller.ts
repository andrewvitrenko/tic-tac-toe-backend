import { Controller, Get, Request } from '@nestjs/common';

import { UseJwtGuard } from '@/auth/guards/jwt.guard';
import { UsersService } from '@/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseJwtGuard()
  @Get('/me')
  getMe(@Request() req) {
    return this.usersService.getById(req.user.id);
  }
}
