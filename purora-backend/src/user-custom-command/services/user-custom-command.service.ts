import { ChatBotInput, ChatBotOutput } from '../../common/dtos/chatBot.dto';
import { Rooms } from '../entities/rooms.entitiy';
import { Injectable } from '@nestjs/common';
import { KeywordRepository } from '../repositories/keyword.repository';
import { keywordList } from './keywords';
import { SHOW_WORKING_LIST } from '../../command-manager/command-manager.constants';
import { RANDOM_LOTTO, RANDOM_PENTION_LOTTO } from '../../constants';
import { RoomsRepository } from '../repositories/rooms.repository';
import { WorkingList } from './working-list.service';
import { LottoDraw } from './lotto-draw.service';
import { WEATHER_COMMAND } from './../../command-manager/command-manager.constants';
import { WeatherService } from './weather.service';

/*
  @author AJu (zoz0312)
  User Custom Command Services
*/
@Injectable()
export class UserCustomCommandService {
  constructor(
    private readonly keyword: KeywordRepository,
    private workingList: WorkingList,
    private lottoDraw: LottoDraw,
    private readonly rooms: RoomsRepository,
    private readonly WeatherService: WeatherService,
  ) {}

  async userCustomCommandForKakao(
    chatBotInput: ChatBotInput,
  ): Promise<ChatBotOutput> {
    const { room, msg, talkChannel } = chatBotInput;

    const roomName = talkChannel.getDisplayName();
    const {
      store: {
        info: { channelId },
      },
    } = talkChannel;

    const myRoom = await this.rooms.findMyRoom(String(channelId));

    if (!myRoom) {
      return {
        success: false,
        message: `등록되지 않은 방입니다.`,
      };
    }

    /* 특정 키워드 필터링 */
    for (let i = 0; i < keywordList.length; i++) {
      const type = keywordList[i];
      if (type.command.includes(msg)) {
        switch (type.name) {
          case SHOW_WORKING_LIST:
            return this.workingList.findWorlingList();
          case RANDOM_LOTTO:
            return this.lottoDraw.randomLottoDraw();
          case RANDOM_PENTION_LOTTO:
            return this.lottoDraw.randomPensionLotto();
          case WEATHER_COMMAND:
            return this.WeatherService.weather(chatBotInput);
        }
      }
    }

    /* 특정 키워드 제외 필터링 */
    if (msg.length > 20) {
      return {
        success: false,
        message: '문자가 너무 깁니다.',
      };
    }

    return this.findRandomCommand(chatBotInput, myRoom);
  }

  async findRandomCommand(
    { room, msg, sender, isGroupChat, image }: ChatBotInput,
    myRoom: Rooms,
  ): Promise<ChatBotOutput> {
    try {
      const outputText = await this.keyword.find({
        where: [
          {
            keyword: msg,
            rooms: myRoom,
            globalStatus: 0,
          },
          {
            keyword: msg,
            globalStatus: 1,
          },
        ],
        relations: ['commands'],
      });

      if (outputText.length === 0) {
        return {
          success: false,
          message: '등록된 키워드가 없습니다.',
        };
      }

      const texts = outputText.reduce((prev, text) => {
        return [...prev, ...text.commands];
      }, []);

      const len = texts.length;
      if (len === 0) {
        return {
          success: false,
          message: '등록된 단어가 없습니다.',
        };
      }

      const ramdomValue = Math.floor(Math.random() * len);
      return {
        success: true,
        message: texts[ramdomValue].outputText,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
}
