import { Injectable } from '@nestjs/common';
import { ChatBotOutput } from 'src/common/dtos/chatBot.dto';
import { HELP_PARTY, HELP_PARTY_DETAIL } from '../command-manager.constants';
import { commandList } from './commands/index';

/*
  @author AJu (zoz0312)
  Party 도움말 관련 명령어
*/
@Injectable()
export class PartyHelp {
  // Call mainService by controller
  mainService(name: string): ChatBotOutput {
    switch (name) {
      case HELP_PARTY:
        return this.printHelp();
      case HELP_PARTY_DETAIL:
        return this.printHelpDetail();
      default:
        return {
          success: false,
          message: `${name}은 잘못 되었습니다.`,
        };
    }
  }

  printHelp() {
    let message = '';
    message += '🌌 포로라 명령어 모음\n';
    message += '\n';
    message += '■ 파티매니저 명령어\n';
    message += '\n';
    message += '/도움말\n';
    message += '/사용법\n';
    message += '/파티리스트\n';
    message += '/파티참여 {파티이름}\n';
    message += '/파티참여 {파티이름::포지션(탑|정글|미드|원딜|서폿)}\n';
    message += '/파티삭제 {파티이름}\n';
    message += '/파티탈퇴 {파티이름}\n';
    message +=
      '/파티생성 {파티이름(포지션|내전)} {시간 (1500, 15:00, 15시 00분)}\n';
    message += '/파티이름수정 {파티이름::변경할 파티이름}\n';
    message +=
      '/파티시간수정 {파티이름::변경할시간 (1500, 15:00, 15시 00분)}\n';
    message += '\n';
    message += '예시)\n';
    message += '/파티생성 내전 2200\n';
    message += '\n';
    message += '■ 포로라 학습하기 명령어\n';
    message += '\n';
    message += '/학습하기 {(학습키워드)::(내용)}\n';
    message += '/학습하기 {(학습키워드)::(내용1)|(내용2)|(내용3)...}\n';
    message += '/학습내역 {학습키워드}\n';
    message +=
      '/학습제거 {[일부삭제](학습키워드)::(ID) 또는 [전체삭제](학습키워드)::all}\n';
    message += '\n';
    message += '예시)\n';
    message += '/학습하기 안녕::안녕하세요\n';
    message += '\n';
    message += '■ 포로라 특정키워드 명령어\n';
    message += '\n';
    message += '로또\n';
    message += '연금복권\n';
    // message += '작업목록\n';
    message += '주식검색\n';
    message += '날씨, 주간날씨\n';

    return {
      success: true,
      message,
    };
  }

  printHelpDetail() {
    let commandDesc = '';
    commandList.map(
      ({ command, name, desc, argumentDesc = [], hiddenFlag = false }) => {
        if (hiddenFlag) {
          return false;
        }
        commandDesc += `[${desc}]\n`;
        command.map(item => {
          commandDesc += `/${item}`;
          if (argumentDesc.length !== 0) {
            argumentDesc.map(arg => {
              commandDesc += ` {${arg}}`;
            });
          }
          commandDesc += '\n';
        });
        commandDesc += '\n';
      },
    );
    return {
      success: true,
      message: commandDesc,
    };
  }
}
