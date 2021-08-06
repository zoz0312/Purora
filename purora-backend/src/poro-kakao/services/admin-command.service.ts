import {Injectable} from "@nestjs/common";
import {ChatBotInput, ChatBotOutput} from "../../common/dtos/chatBot.dto";
import {adminCommandList} from "../commands";
import {ADMIN_KAKAO_ROOM_SERVICE, ADMIN_KAKAO_USER_SERVICE} from "../../command-manager/command-manager.constants";
import {KakaoUserService} from "./kakao-user.service";
import {KakaoRoomService} from "./kakao-room.service";

@Injectable()
export class AdminCommandService {
  constructor(
    private kakaoUserService: KakaoUserService,
    private kakaoRoomService: KakaoRoomService,
  ) {
  }

  async adminCommandManage(
    chatBotInput : ChatBotInput,
  ): Promise<ChatBotOutput> {
    const userCommand = chatBotInput.msg.slice(1);
    const command = userCommand.split('::')[0];

    for (let i=0; i<adminCommandList.length; i++) {
      const {
        command: cmd,
        service,
        name,
      } = adminCommandList[i];

      if (cmd.includes(command)) {
        switch (service) {
          case ADMIN_KAKAO_USER_SERVICE:
            return this.kakaoUserService.mainService(chatBotInput, name);
          case ADMIN_KAKAO_ROOM_SERVICE:
            return this.kakaoRoomService.mainService(chatBotInput, name);
        }
      }
    }
    return {
      success: true,
      message: '',
    }
  }

}