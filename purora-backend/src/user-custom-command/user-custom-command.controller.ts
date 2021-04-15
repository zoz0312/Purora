import { Body, Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatBotInput, ChatBotOutput } from '../common/dtos/chatBot.dto';
import { Commands } from './entities/commands.entitiy';
import { Keyword } from './entities/keyword.entitiy';
import { keywordList } from './services/keywords/index';
import { WorkingList } from './services/working-list.service';
import { LottoDraw } from './services/lotto-draw.service';
import { UserCustomCommandService } from './services/user-custom-command.service';
import { RANDOM_LOTTO, RANDOM_PENTION_LOTTO } from '../constants';
import { RoomsRepository } from './repositories/rooms.repository';
import { SHOW_WORKING_LIST } from 'src/command-manager/command-manager.constants';

/*
  @author AJu (zoz0312)
  '/명령어'를 제외한 유저의 텍스트를 받아 처리하는 곳
*/
@Controller('user-custom-command')
export class UserCustomCommandController {
  constructor(
    private workingList: WorkingList,
    private lottoDraw: LottoDraw,
    private customCommand: UserCustomCommandService,
    private readonly rooms: RoomsRepository,
  ) {}

  @Post()
  async userCustomCommand(
		@Body()
		chatBotInput : ChatBotInput
	): Promise<ChatBotOutput> {
		const {
			room,
			msg,
			sender,
			isGroupChat,
			image,
		} = chatBotInput;

    const myRoom = await this.rooms.findMyRoom(room);

    /* 특정 키워드 필터링 */
    for (let i=0; i<keywordList.length; i++) {
      const type = keywordList[i];
      if (type.command.includes(msg)) {
        switch (type.name) {
          case SHOW_WORKING_LIST:
            return this.workingList.findWorlingList();
          case RANDOM_LOTTO:
            return this.lottoDraw.randomLottoDraw();
          case RANDOM_PENTION_LOTTO:
            return this.lottoDraw.randomPensionLotto();
        }
      }
    }

    /* 특정 키워드 제외 필터링 */
    if (msg.length > 20) {
      return {
        success: false,
        message: '문자가 너무 깁니다.',
      }
    }

		return this.customCommand.findRandomCommand(chatBotInput, myRoom);
  }
}
