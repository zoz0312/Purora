import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './repositories/users.repository';
import { UsersSummonerInfoRepository } from './repositories/users-summoner-info.repository';

@Module({
  imports: [TypeOrmModule.forFeature([
    UsersSummonerInfoRepository,
    UsersRepository,
  ])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UserModule {}
