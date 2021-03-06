import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeywordRepository } from 'src/user-custom-command/repositories/keyword.repository';
import { UsersSummonerInfoRepository } from '../users/repositories/users-summoner-info.repository';
import { UsersRepository } from '../users/repositories/users.repository';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    UsersSummonerInfoRepository,
    UsersRepository,
    KeywordRepository,
  ])],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
