import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './repositories/users.repository';
import { UsersSummonerInfoRepository } from './repositories/users-summoner-info.repository';
import { UsersGameInfoRepotitory } from './repositories/users-game-info.repository';

@Module({
  imports: [TypeOrmModule.forFeature([
    UsersSummonerInfoRepository,
    UsersRepository,
    UsersGameInfoRepotitory,
  ])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
