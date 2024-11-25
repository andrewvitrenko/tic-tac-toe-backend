import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalGuard extends AuthGuard('local') {}

export const UseLocalGuard = () => UseGuards(LocalGuard);
