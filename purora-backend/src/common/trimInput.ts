
import { ChatBotInput } from './dtos/chatBot.dto';

/*
  @author AJu (zoz0312)
  trimInput
   - ChatBot에서 보낸 인자들을 command와 argument로 쪼개주는 함수
*/
export const trimInput = ({
  room,
  msg,
  sender,
  isGroupChat,
  image,
}: ChatBotInput) => {
  const totalCommand = msg.slice(1);
  const splitMsg = totalCommand.split(' ');
  const command = splitMsg[0];
  const argument = splitMsg.slice(1).join(' ');

  return [command, argument];
}