import { Body, Controller, Post, Request } from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';
import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { UseLocalGuard } from '@/auth/guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseLocalGuard()
  @Post('/login')
  login(@Request() req) {
    return this.authService.login(req.user.id);
  }

  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}
