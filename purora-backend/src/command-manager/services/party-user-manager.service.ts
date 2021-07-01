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
    const { room, sender } = chatBotInput;
    const [_, trimText] = trimInput(chatBotInput);
    const [partyName, position] = trimText.split('::');

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

      const currentPartyType = party[room][partyName].type;
      if (currentPartyType === partyType.NONE) {
        party[room][partyName].user.push(sender);
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

        for (let i=0; i<party[room][partyName].user.length; i++) {
          if (party[room][partyName].user[i].name === sender) {
            return {
              success: false,
              message: `이미 참여한 파티입니다!`,
            }
          }
          if (party[room][partyName].user[i].position === userPosition[position]) {
            return {
              success: false,
              message: '이미 참여된 포지션입니다 ㅠ_ㅠ',
            }
          }
        }

        party[room][partyName].user.push({
          name: sender,
          position: userPosition[position],
        });
      }

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
      let idx = -1;
      if (typeof party[room][partyName].user === 'object') {
        for (let i=0; i<party[room][partyName].user.length; i++) {
          if (party[room][partyName].user[i].name === sender) {
            idx = i;
            break;
          }
        }
      } else {
        idx = party[room][partyName].user.indexOf(sender);
      }

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