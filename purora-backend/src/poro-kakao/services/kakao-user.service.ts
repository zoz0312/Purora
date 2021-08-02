import {Injectable} from "@nestjs/common";
import {ChatBotInput, ChatBotOutput} from "../../common/dtos/chatBot.dto";
import {TalkChatData} from "node-kakao/dist/talk/chat";
import {TalkChannel} from "node-kakao/dist/talk/channel";
import {KAKAO_USER_GET_ID} from "../../command-manager/command-manager.constants";

@Injectable()
export class KakaoUserService {
  constructor(
  ) {
  }

  async mainService(
    chatBotInput :ChatBotInput,
    name: string,
    data: TalkChatData,
    channel: TalkChannel,
  ): Promise<ChatBotOutput> {
    switch (name) {
      case KAKAO_USER_GET_ID:
        return this.getUserId(data, channel);
      default:
        return {
          success: false,
          message: `${name}은 잘못 되었습니다.`
        }
    }
  }

  async getUserId (
    data: TalkChatData,
    channel: TalkChannel,
  ): Promise<ChatBotOutput> {
    return {
      success: true,
    }
  }

}