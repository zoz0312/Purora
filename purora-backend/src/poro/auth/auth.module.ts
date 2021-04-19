import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { UsersModule } from '../users/users.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [UsersModule],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard,
  }]
})
export class AuthModule {}

