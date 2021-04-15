import { Module } from '@nestjs/common';
import { UserCustomCommandController } from './user-custom-command.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commands } from './entities/commands.entitiy';
import { Keyword } from './entities/keyword.entitiy';
import { WorkingList } from './services/working-list.service';
import { Working } from './entities/working.entity';
import { LottoDraw } from './services/lotto-draw.service';
import { UserCustomCommandService } from './services/user-custom-command.service';
import { Rooms } from './entities/rooms.entitiy';
import { RoomsRepository } from './repositories/rooms.repository';
import { KeywordRepository } from './repositories/keyword.repository';
import { CommandsRepository } from './repositories/commands.repository';
import { WorkingRepository } from './repositories/working.repository';

/*
  @author AJu (zoz0312)
  '/명령어'를 제외한 유저의 텍스트를 받을 수 있는 모듈의 묶음
*/
@Module({
  imports: [TypeOrmModule.forFeature([
    Commands,
    CommandsRepository,
    Keyword,
    KeywordRepository,
    Working,
    WorkingRepository,
    Rooms,
    RoomsRepository,
  ])],
  controllers: [UserCustomCommandController],
  providers: [
    WorkingList,
    LottoDraw,
		UserCustomCommandService
  ],
})
export class UserCustomCommandModule {}
