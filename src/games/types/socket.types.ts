import { User } from '@prisma/client';
import { Socket } from 'socket.io';

export type TSocket = Socket & {
  user: User;
};
