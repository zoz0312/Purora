import { party, partyStructure } from '../../cache-party';
import { deepCopy } from 'deep-copy-ts';
import { translateParty2String } from '../command-manager.controller';
import { trimInput } from '../../common/trimInput';
import { ChatBotInput, ChatBotOutput } from 'src/common/dtos/chatBot.dto';
import { Injectable } from '@nestjs/common';
import { CREATE_PARTY, DELETE_PARTY, FIND_PARTY, PARTY_PRINT_JSON } from '../command-manager.constants';

/*
  @author AJu (zoz0312)
  Party 관리 관련 명령어
*/
@Injectable()
export class PartyManager {
  constructor (
  ) {
  }

  // Call mainService by controller
  mainService (
    chatBotInput :ChatBotInput,
    name: string,
  ): ChatBotOutput {
    switch (name) {
      case FIND_PARTY:
        return this.findParty(chatBotInput);
      case PARTY_PRINT_JSON:
        return this.printPartyJson();
      case CREATE_PARTY:
        return this.createParty(chatBotInput);
      case DELETE_PARTY:
        return this.deleteParty(chatBotInput);
      default:
        return {
          success: false,
          message: `${name}은 잘못 되었습니다.`
        }
    }
  }

  findParty (
    { room } :ChatBotInput
  ): ChatBotOutput {
    return {
      success: true,
      message: translateParty2String({
        room,
        message: '지금까지의 파티 목록입니다!',
      }),
    };
  }

  printPartyJson (): ChatBotOutput {
    const partyDeepClone = deepCopy(party);
    partyDeepClone['curDate'] = new Date();
    return {
      success: true,
      message: JSON.stringify(partyDeepClone),
    }
  }

  createParty(
    chatBotInput :ChatBotInput
  ): ChatBotOutput {
    const { room } = chatBotInput;
    const [_, arguement] = trimInput(chatBotInput);
    const args = arguement.split(' ');
    const partyName = args[0];
    const times = args.slice(1).join('').replace(/[^0-9]/g, '');

    /* command 정상 입력 유효성 검사 */
    if (!partyName) {
      return {
        success: false,
        message: '파티 이름 오류!',
      }
    }
    if (!times) {
      return {
        success: false,
        message: '시간 입력 오류!',
      }
    }

    /* 파티 이름 중복 유효성 검사 */
    if (!party[room]) {
      party[room] = {};
    }

    const parties = Object.keys(party[room]);
    for (let i=0; i<parties.length; i++) {
      if (parties[i] === partyName) {
        return {
          success: false,
          message: `${partyName} 이미 존재하는 파티입니다.`,
        }
      }
    }

    /* 시간 입력 범위 유효성 검사 */
    let hours = 0;
    let minutes = 0;
    if (times.length === 3) {
      hours = +times[0];
      minutes = +times.slice(1);
    } else if (times.length === 4) {
      hours = +times.slice(0, 2);
      minutes = +times.slice(2, 4);
    }

    if (hours < 0 && hours > 24) {
      return {
        success: false,
        message: '시간 입력이 잘못되었습니다.',
      }
    }
    if (minutes < 0 && minutes > 59) {
      return {
        success: false,
        message: '분 입력이 잘못되었습니다.',
      }
    }

    const curDate = new Date();
    const partyDate = new Date(
      curDate.getFullYear(),
      curDate.getMonth(),
      curDate.getDate(),
      hours,
      minutes,
      10
    );

    party[room][partyName] = {
      ...deepCopy(partyStructure),
      time: partyDate,
    }

    return {
      success: true,
      message: `${partyName} 파티가 생성되었습니다!`,
    }
  }

  deleteParty(
    chatBotInput :ChatBotInput
  ): ChatBotOutput {
    const { room } = chatBotInput;
    const [_, partyName] = trimInput(chatBotInput);
    if (!partyName) {
      return {
        success: false,
        message: '삭제할 파티를 입력해주세요!',
      }
    }

    if (!party[room]) {
      party[room] = {};
    }

    const parties = Object.keys(party[room]);
    for (let i=0; i<parties.length; i++) {
      if (parties[i] === partyName) {
        delete party[room][partyName];
        return {
          success: true,
          message: `${partyName} 파티가 삭제되었습니다!`,
        }
      }
    }
    return {
      success: false,
      message: '존재하지 않는 파티입니다.',
    }
  }
}