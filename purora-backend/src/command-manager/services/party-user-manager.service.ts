import { Injectable } from '@nestjs/common';
import { party } from '../../cache-party';
import { ChatBotInput, ChatBotOutput } from '../../common/dtos/chatBot.dto';
import { trimInput } from '../../common/trimInput';
import { ENTER_PARTY, EXIT_PARTY } from '../command-manager.constants';
import { translateParty2String } from '../command-manager.controller';

/*
  @author AJu (zoz0312)
  Party 참가 유저 관련 명령어
*/
@Injectable()
export class PartyUserManager {
  constructor (
  ) {
  }

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
    const { room, sender } = chatBotInput;
    const [_, partyName] = trimInput(chatBotInput);
    if (!partyName) {
      return {
        success: false,
        message: '참여할 파티를 입력해주세요!',
      }
    }

    if (!party[room]) {
      party[room] = {};
    }

    if (Object.keys(party[room]).includes(partyName)) {
      if (party[room][partyName].user.includes(sender)) {
        return {
          success: false,
          message: `이미 참여한 파티입니다!`,
        }
      }

      let maximum = 5;
      if (
        partyName.includes('내전')
        || partyName.includes('스크림')
      ) {
        maximum = 10;
      } else if (
        partyName.includes('롤토체스')
        || partyName.includes('롤체')
      ) {
        maximum = 8;
      }

      if (party[room][partyName].user.length >= maximum) {
        return {
          success: false,
          message: '파티가 꽉 찼습니다 ㅠ.ㅠ',
        }
      }
      party[room][partyName].user.push(sender);

      return {
        success: true,
        message: translateParty2String({
          room,
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
    const { room, sender } = chatBotInput;
    const [_, partyName] = trimInput(chatBotInput);

    if (!partyName) {
      return {
        success: false,
        message: '떠날 파티를 입력해주세요!',
      }
    }

    if (!party[room]) {
      party[room] = {};
    }

    if (Object.keys(party[room]).includes(partyName)) {
      const idx = party[room][partyName].user.indexOf(sender);
      if (idx !== -1) {
        party[room][partyName].user.splice(idx, 1);
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