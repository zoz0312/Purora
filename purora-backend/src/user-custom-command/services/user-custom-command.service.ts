import { ChatBotInput, ChatBotOutput } from '../../common/dtos/chatBot.dto';
import { Keyword } from '../entities/keyword.entitiy';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rooms } from '../entities/rooms.entitiy';
import { Injectable } from '@nestjs/common';
import { KeywordRepository } from '../repositories/keyword.repository';
import {keywordList} from "./keywords";
import {SHOW_WORKING_LIST} from "../../command-manager/command-manager.constants";
import {RANDOM_LOTTO, RANDOM_PENTION_LOTTO} from "../../constants";
import {RoomsRepository} from "../repositories/rooms.repository";
import {WorkingList} from "./working-list.service";
import {LottoDraw} from "./lotto-draw.service";

/*
  @author AJu (zoz0312)
  User Custom Command Services
*/
@Injectable()
export class UserCustomCommandService {
  constructor (
    private readonly keyword: KeywordRepository,
    private workingList: WorkingList,
    private lottoDraw: LottoDraw,
    private readonly rooms: RoomsRepository,
  ) {
  }

  async userCustomCommandForKakao (
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

    return this.findRandomCommand(chatBotInput, myRoom);
  }

	async findRandomCommand (
		{
			room,
			msg,
			sender,
			isGroupChat,
			image,
		}: ChatBotInput,
    myRoom: Rooms,
	): Promise<ChatBotOutput> {
		try {
      const outputText = await this.keyword.findOne({
        where: {
          keyword: msg,
          rooms: myRoom,
        },
        relations: ['commands']
      });

      if (!outputText) {
        return {
          success: false,
          message: '등록된 키워드가 없습니다.'
        }
      }

      const len = outputText.commands.length;
      if (len === 0) {
        return {
          success: false,
          message: '등록된 단어가 없습니다.'
        }
      }

      const ramdomValue = Math.floor(Math.random() * (len));
			return {
        success: true,
        message: outputText.commands[ramdomValue].outputText,
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }

  }
}
