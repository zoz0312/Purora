import { Injectable } from '@nestjs/common';
import { ChatBotInput, ChatBotOutput } from '../../common/dtos/chatBot.dto';
import { ADMIN_HELP } from '../../command-manager/command-manager.constants';

@Injectable()
export class AdminHelpService {
  constructor() {}

  async mainService(
    chatBotInput: ChatBotInput,
    name: string,
  ): Promise<ChatBotOutput> {
    switch (name) {
      case ADMIN_HELP:
        return this.adminHelp(chatBotInput);
      default:
        return {
          success: false,
          message: `${name}은 잘못 되었습니다.`,
        };
    }
  }

  async adminHelp(chatBotInput: ChatBotInput): Promise<ChatBotOutput> {
    let message = '';
    message += '🌌 포로라 관리자 명령어 모음\n\n';
    message += '[!] 를 통해 실행 가능\n\n';
    message += '■ Admin 유저 관리\n';
    message += '!help\n';
    message += '!getUserId (&Mention)\n';
    message += '!addUserId (&Mention)\n';
    message += '!deleteUserId (&Mention)\n';
    message += '!allMention\n';
    message += '\n';
    message += '■ 허용방 관리\n';
    message += '!getRoomId\n';
    message += '!addRoom\n';
    message += '!deleteRoom\n';

    return {
      message,
      success: true,
    };
  }
}
