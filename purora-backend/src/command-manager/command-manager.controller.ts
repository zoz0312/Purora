import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ChatBotInput, ChatBotOutput } from '../common/dtos/chatBot.dto';
import {
  party,
  partyStructure,
  partyStructureDTO,
  partyType,
  PartyUserDTO,
  rank,
  rankPosition,
  teamFight
} from '../cache-party';
import { PartyManager } from './services/party-manager.service';
import {
  PARTY_MANAGER_SERVICE,
  WORKING_LIST_MANAGER_SERVICE,
  PARTY_HELP_SERVICE
} from './command-manager.constants';
import { PartyUserManager } from './services/party-user-manager.service';
import { Cron } from '@nestjs/schedule';
import { commandList } from './services/commands/index';
import { PartyHelp } from './services/party-help.service';
import { CustomUserCommand } from './services/custom-user-command.service';
import { WorkingListManager } from './services/working-list.service';
import { PARTY_USER_MANAGER_SERVICE } from 'src/command-manager/command-manager.constants';
import { CUSTOM_USER_COMMAND_SERVICE } from 'src/command-manager/command-manager.constants';
import {deepCopy} from "deep-copy-ts";

/*
  @author AJu (zoz0312)
  Party Manager의 Contoller
  주요 명령어들을 선언 및 호출하는 곳
*/
@Controller('command-manager')
export class CommandManagerController {
  constructor (
    private customUserCommand: CustomUserCommand,
    private partyManager: PartyManager,
    private partyUserManager: PartyUserManager,
    private partyHelp: PartyHelp,
    private workingManager: WorkingListManager,
  ) {}

  @Post()
  async commandManage(
    @Body() chatBotInput: ChatBotInput
  ): Promise<ChatBotOutput> {
    const { msg } = chatBotInput;
    if (msg === undefined || msg === '') {
      return {
        success: false,
        message: '비정상적인 명령어 입니다 (X_x)',
      };
    }


    if (msg[0] === '/') {
      const userCommand = msg.slice(1);
      const command = userCommand.split(' ')[0];

      for (let i=0; i<commandList.length; i++) {
        const {
          command: cmd,
          service,
          name,
        } = commandList[i];

        if (cmd.includes(command)) {
          switch (service) {
            case PARTY_MANAGER_SERVICE:
              return this.partyManager.mainService(chatBotInput, name);
            case PARTY_USER_MANAGER_SERVICE:
              return this.partyUserManager.mainService(chatBotInput, name);
            case CUSTOM_USER_COMMAND_SERVICE:
              return this.customUserCommand.mainService(chatBotInput, name);
            case WORKING_LIST_MANAGER_SERVICE:
              return this.workingManager.mainService(chatBotInput, name);
            case PARTY_HELP_SERVICE:
              return this.partyHelp.mainService(name);
          }
        }
      }
    }

    return {
      success: false,
      message: '비정상적인 명령어 입니다 (X_x)',
    };
  }

  /* Party Delete Scheduler Every minute on the 0th second */
  @Cron('0 * * * * *')
  deletePartyScheduler() {
    const curDate = new Date();
    Object.keys(party).map(roomName =>
      Object.keys(party[roomName]).map(partyName => {
        if (curDate > party[roomName][partyName].time) {
          delete party[roomName][partyName]
        }
      })
    );
  }

  /*
    매일 정각에 파티 초기화
  */
  @Cron('0 0 * * * *',{
    name: 'dailyPartyDefine',
    timeZone: 'Europe/Paris',
  }) // 영국시간 = (UTC+9) - 9
  dailyPartyDefine() {
    const currentDate = new Date();
    if (currentDate.getHours() === 0) {
      party['롤키웨이(LoLky Way)'] = {
        '매일자랭': {
          ...deepCopy(partyStructure),
          time: rank(),
          type: partyType.NONE,
        },
        '매일내전': {
          ...deepCopy(partyStructure),
          time: teamFight(),
          type: partyType.NONE,
        },
      };
      party['숨고 (정예톡)'] = {
        '자랭포지션': {
          ...deepCopy(partyStructure),
          time: rankPosition(),
          type: partyType.POSITION,
        }
      };
    }
  }
}

/*
  translateParty2String
  설명: party Object를 String으로 변환하는 함수
  인자:
   - message: 파티 목록의 맨 마지막에 붙혀줄 메시지
*/
export const translateParty2String = ({
  room = '',
  message = '',
  partyName = '',
}) => {
  const partyPart = (
    partyName: string,
    partyObject: partyStructureDTO
  ) => {
    let str = '';
    const date = partyObject.time;

    str += `${partyName} - ${date.getHours()}시`;
    if (date.getMinutes() > 0) {
      str += ` ${date.getMinutes()}분`;
    }
    str += '\n';

    if (partyObject.user.length === 0) {
      str += `--- 없음 ---\n`;
    } else {
      if (partyObject.type === partyType.NONE) {
        partyObject.user.map((user: string | PartyUserDTO, index) => {
          if (typeof user === 'string') {
            str += `${index+1}. ${user}\n`;
          }
        });
      } else if (partyObject.type === partyType.POSITION) {
        partyObject.user.map((user: string | PartyUserDTO) => {
          if (typeof user === 'object') {
            str += `${user.position}: ${user.name}\n`;
          }
        });
      }
    }
    return str += '\n'
  }

  if (room === '') {
    return '잘못된 방입니다.';
  }

  if (!party[room]) {
    party[room] = {};
  }

  const myRoom = party[room];
  const keys = Object.keys(party[room]);
  let str = '';

  if (keys.length === 0) {
    str = '[파티없음]';
  } else {
    if (partyName) {
      str += partyPart(partyName, myRoom[partyName]);
    } else {
      keys.map((item, index) => {
        str += partyPart(keys[index], myRoom[item]);
      });
    }
  }

  if (message) {
    str += `\n${message}`;
  }
  return str;
}

