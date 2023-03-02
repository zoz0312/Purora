import { CoreOutput } from './output.dto';
import { TalkChatData } from '@numeralpharic/node-kakao/dist/talk/chat';
import { TalkChannel } from '@numeralpharic/node-kakao/dist/talk/channel';

/*
  @author AJu (zoz0312)
  chatBot에서 보내고 받는 인자의 DTO
*/
export class ChatBotInput {
  room: string; // 방 이름
  msg: string; // 메시지
  sender: string; // 보낸이
  isGroupChat: boolean; // 단체/오픈채팅 여부
  image: string; // Profile Image base64
  kakaoSender?: sender;
  roomInfo?: roomInfo;
  talkChatData?: TalkChatData;
  talkChannel?: TalkChannel;
}

class sender {
  userId: number;
  profileURL: string;
  fullProfileURL: string;
  originalProfileURL: string;
}

class roomInfo {
  channelId: number;
}

export class ChatBotOutput extends CoreOutput {}
