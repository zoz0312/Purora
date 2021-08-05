import {party, partyStructure, partyType} from '../../cache-party';
import {deepCopy} from 'deep-copy-ts';
import {translateParty2String} from '../command-manager.controller';
import {trimInput} from '../../common/utils';
import {ChatBotInput, ChatBotOutput} from 'src/common/dtos/chatBot.dto';
import {Injectable} from '@nestjs/common';
import {
  CREATE_PARTY,
  DELETE_PARTY,
  FIND_PARTY,
  MODIFY_PARTY_TIME,
  PARTY_PRINT_JSON
} from '../command-manager.constants';
import {MODIFY_PARTY_NAME} from './../command-manager.constants';

/*
  @author AJu (zoz0312)
  Party 관리 관련 명령어
*/
@Injectable()
export class PartyManager {
  constructor (
  ) {}

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
      case MODIFY_PARTY_NAME:
        return this.modifyPartyName(chatBotInput);
      case MODIFY_PARTY_TIME:
        return this.modifyPartyTime(chatBotInput);
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
    { room, roomInfo } :ChatBotInput
  ): ChatBotOutput {
    return {
      success: true,
      message: translateParty2String({
        room,
        roomInfo,
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

  partyTimeValidation(partyTime) {
    const times = partyTime.replace(/[^0-9]/g, '');

    if (!times) {
      return {
        success: false,
        message: '시간 입력 오류!',
      }
    }

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

    return {
      success: true,
      hours,
      minutes
    }
  }

  createParty(
    chatBotInput :ChatBotInput
  ): ChatBotOutput {
    const { room, roomInfo, talkChannel } = chatBotInput;
    const [_, arguement] = trimInput(chatBotInput);
    const args = arguement.split(' ');
    const partyName = args[0];

    const roomName = roomInfo ? roomInfo.channelId : room;

    /* command 정상 입력 유효성 검사 */
    if (!partyName) {
      return {
        success: false,
        message: '파티 이름 오류!',
      }
    }

    /* 파티 이름 중복 유효성 검사 */
    if (!party[roomName]) {
      party[roomName] = {};
    }

    if (!party[roomName].hasOwnProperty('channel')) {
      party[roomName].channel = talkChannel;
    }

    const parties = Object.keys(party[roomName]);
    for (let i=0; i<parties.length; i++) {
      if (parties[i] === partyName) {
        return {
          success: false,
          message: `${partyName} 이미 존재하는 파티입니다.`,
        }
      }
    }

    const times = this.partyTimeValidation(args.slice(1).join(''));

    if (!times.success) {
      return times;
    }

    const curDate = new Date();
    const partyDate = new Date(
      curDate.getFullYear(),
      curDate.getMonth(),
      curDate.getDate(),
      times.hours,
      times.minutes,
      10
    );

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

    party[roomName][partyName] = {
      ...deepCopy(partyStructure),
      time: partyDate,
      type: partyName.includes('포지션') ? partyType.POSITION : partyType.NONE,
      maximum,
    }

    return {
      success: true,
      message: `${partyName} 파티가 생성되었습니다!`,
    }
  }

  modifyPartyName(
    chatBotInput :ChatBotInput
  ): ChatBotOutput {
    const { room, roomInfo } = chatBotInput;
    const [_, partyName] = trimInput(chatBotInput);
    const [origParty, changeParty] = partyName.split('::');

    const roomName = roomInfo ? roomInfo.channelId : room;

    if (!origParty) {
      return {
        success: false,
        message: '수정할 파티를 입력해주세요!',
      }
    }

    if (!changeParty) {
      return {
        success: false,
        message: '변경할 파티이름을 입력해주세요!',
      }
    }

    if (!party[roomName]) {
      party[roomName] = {};
    }

    const parties = Object.keys(party[roomName]);
    const trimPartyName = changeParty.trim();

    for (let i=0; i<parties.length; i++) {
      if (parties[i] === origParty) {
        const temp = {
          ...party[roomName][origParty]
        };
        delete party[roomName][origParty];
        party[roomName][trimPartyName] = {
          ...temp
        }
        return {
          success: true,
          message: `${trimPartyName} 파티로 변경되었습니다!`,
        }
      }
    }
    return {
      success: false,
      message: '존재하지 않는 파티입니다.',
    }
  }

  modifyPartyTime(
    chatBotInput :ChatBotInput
  ): ChatBotOutput {
    const { room, roomInfo } = chatBotInput;
    const [_, partyName] = trimInput(chatBotInput);
    const [origParty, changeTime] = partyName.split('::');

    const roomName = roomInfo ? roomInfo.channelId : room;

    if (!origParty) {
      return {
        success: false,
        message: '수정할 파티를 입력해주세요!',
      }
    }

    const times = this.partyTimeValidation(changeTime);

    if (!times.success) {
      return times;
    }

    const curDate = new Date();
    const partyDate = new Date(
      curDate.getFullYear(),
      curDate.getMonth(),
      curDate.getDate(),
      times.hours,
      times.minutes,
      10
    );

    if (!party[roomName]) {
      party[roomName] = {};
    }

    const parties = Object.keys(party[roomName]);
    for (let i=0; i<parties.length; i++) {
      if (parties[i] === origParty) {
        party[roomName][origParty] = {
          ...party[roomName][origParty],
          time: partyDate,
        }
        return {
          success: true,
          message: `${times.hours}시 ${times.minutes}분으로 시간이 변경되었습니다!`,
        }
      }
    }
    return {
      success: false,
      message: '존재하지 않는 파티입니다.',
    }
  }

  deleteParty(
    chatBotInput :ChatBotInput
  ): ChatBotOutput {
    const { room, roomInfo } = chatBotInput;
    const [_, partyName] = trimInput(chatBotInput);

    const roomName = roomInfo ? roomInfo.channelId : room;

    if (!partyName) {
      return {
        success: false,
        message: '삭제할 파티를 입력해주세요!',
      }
    }

    if (!party[roomName]) {
      party[roomName] = {};
    }

    const parties = Object.keys(party[roomName]);
    for (let i=0; i<parties.length; i++) {
      if (parties[i] === partyName) {
        delete party[roomName][partyName];
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