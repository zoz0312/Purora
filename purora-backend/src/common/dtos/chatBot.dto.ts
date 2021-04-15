import { CoreOutput } from './output.dto';

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
};

export class ChatBotOutput extends CoreOutput {

}