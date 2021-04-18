import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './repositories/users.repository';
import { UsersGameInfoRepository } from './repositories/users-game-info.repository';

@Module({
  imports: [TypeOrmModule.forFeature([
    UsersGameInfoRepository,
    UsersRepository,
  ])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UserModule {}
