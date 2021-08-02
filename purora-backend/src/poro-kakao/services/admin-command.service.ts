import {Injectable} from "@nestjs/common";
import {AllowRoomRepository} from "../repositories/allow-room.repository";
import {ChatBotInput, ChatBotOutput} from "../../common/dtos/chatBot.dto";
import {TalkChatData} from "node-kakao/dist/talk/chat";
import {TalkChannel} from "node-kakao/dist/talk/channel";
import {adminCommandList} from "../commands";
import {ADMIN_KAKAO_USER_SERVICE} from "../../command-manager/command-manager.constants";
import {KakaoUserService} from "./kakao-user.service";
import {WorkingListManager} from "../../command-manager/services/working-list.service";

@Injectable()
export class AdminCommandService {
  constructor(
    private kakaoUserService: KakaoUserService,
  ) {
  }

  async adminCommandManage(
    chatBotInput : ChatBotInput,
    data: TalkChatData,
    channel: TalkChannel,
  ): Promise<ChatBotOutput> {

    const command = '';

    for (let i=0; i<adminCommandList.length; i++) {
      const {
        command: cmd,
        service,
        name,
      } = adminCommandList[i];

      if (cmd.includes(command)) {
        switch (service) {
          case ADMIN_KAKAO_USER_SERVICE:
            return this.kakaoUserService.mainService(chatBotInput, name, data, channel);
        }
      }
    }
    return {
      success: true,
      message: '',
    }
  }

}