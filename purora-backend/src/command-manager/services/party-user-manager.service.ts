import { Injectable } from '@nestjs/common';
import {party, partyType, userPosition} from '../../cache-party';
import { ChatBotInput, ChatBotOutput } from '../../common/dtos/chatBot.dto';
import { trimInput } from '../../common/utils';
import { ENTER_PARTY, EXIT_PARTY } from '../command-manager.constants';
import { translateParty2String } from '../command-manager.controller';

/*
  @author AJu (zoz0312)
  Party 참가 유저 관련 명령어
*/
@Injectable()
export class PartyUserManager {
  // Call mainService by controller
  mainService (
    chatBotInput :ChatBotInput,
    name: string,
  ): ChatBotOutput {
    switch (name) {
      case ENTER_PARTY:
        return this.enterParty(chatBotInput);
      case EXIT_PARTY:
        return this.exitParty(chatBotInput);
      default:
        return {
          success: false,
          message: `${name}은 잘못 되었습니다.`
        }
    }
  }

  /*
    enterParty
     - 파티에 참여하는 유저
  */
  enterParty(
    chatBotInput :ChatBotInput
  ): ChatBotOutput {
    const { room, sender, roomInfo, kakaoSender, talkChatData } = chatBotInput;
    const [_, trimText] = trimInput(chatBotInput);
    const [partyName, position] = trimText.split('::');

    const splitSender = sender.split('/')[0];

    const roomName = roomInfo ? roomInfo.channelId : room;

    if (!partyName) {
      return {
        success: false,
        message: '참여할 파티를 입력해주세요!',
      }
    }

    if (!party[roomName]) {
      party[roomName] = {};
    }

    if (Object.keys(party[roomName]).includes(partyName)) {
      if (party[roomName][partyName].user.length >= party[roomName][partyName].maximum) {
        return {
          success: false,
          message: '파티가 꽉 찼습니다 ㅠ.ㅠ',
        }
      }

      const currentPartyType = party[roomName][partyName].type;
      if (currentPartyType === partyType.NONE) {
        for (let i=0; i<party[roomName][partyName].user.length; i++) {
          if (party[roomName][partyName].user[i].id === kakaoSender.userId) {
            return {
              success: false,
              message: `이미 참여한 파티입니다!`,
            }
          }
        }
        party[roomName][partyName].user.push({
          id: kakaoSender.userId,
          name: splitSender,
          info: talkChatData,
        });
      } else if (currentPartyType === partyType.POSITION) {
        if (!position) {
          return {
            success: false,
            message: '포지션을 입력해주세요 O_x',
          }
        }

        if (!userPosition.hasOwnProperty(position)) {
          return {
            success: false,
            message: '존재하지 않는 포지션입니다 X_x',
          }
        }

        for (let i=0; i<party[roomName][partyName].user.length; i++) {
          if (party[roomName][partyName].user[i].id === kakaoSender.userId) {
            return {
              success: false,
              message: `이미 참여한 파티입니다!`,
            }
          }
          if (party[roomName][partyName].user[i].position === userPosition[position]) {
            return {
              success: false,
              message: '이미 참여된 포지션입니다 ㅠ_ㅠ',
            }
          }
        }

        party[roomName][partyName].user.push({
          id: kakaoSender.userId,
          name: splitSender,
          position: userPosition[position],
          info: talkChatData,
        });
      }

      return {
        success: true,
        message: translateParty2String({
          room,
          roomInfo,
          message: `${partyName} 파티에 참여하였습니다.`,
          partyName,
        }),
      }
    }

    return {
      success: false,
      message: `참여할 파티가 존재하지 않습니다.`,
    }
  }

  /*
    exitParty
     - 파티에 떠나는 유저
  */
  exitParty(
    chatBotInput :ChatBotInput
  ): ChatBotOutput {
    const { room, sender, roomInfo, kakaoSender: { userId: inputUserId } } = chatBotInput;
    const userId = +inputUserId;
    const [_, partyName] = trimInput(chatBotInput);

    const roomName = roomInfo ? roomInfo.channelId : room;

    if (!partyName) {
      return {
        success: false,
        message: '떠날 파티를 입력해주세요!',
      }
    }

    if (!party[roomName]) {
      party[roomName] = {};
    }

    if (Object.keys(party[roomName]).includes(partyName)) {
      let idx = -1;

      for (let i=0; i<party[roomName][partyName].user.length; i++) {
        const currnetUserId = party[roomName][partyName].user[i].id;
        if (currnetUserId === userId) {
          idx = i;
          break;
        }
      }

      if (idx !== -1) {
        party[roomName][partyName].user.splice(idx, 1);
        return {
          success: true,
          message: `${partyName} 파티에서 떠났습니다~ :D`,
        }
      }
      return {
        success: false,
        message: '떠날 파티가 없습니다.. ㅜ.ㅜ',
      }
    }
    return {
      success: false,
      message: '존재하지 않는 파티입니다. O_o!',
    }
  }
}