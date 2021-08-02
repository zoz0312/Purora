import {KnownChatType, ReplyAttachment} from "node-kakao";
import {TalkChatData} from "node-kakao/dist/talk/chat";
import {TalkChannel} from "node-kakao/dist/talk/channel";
import {ChannelUserInfo} from "node-kakao/dist/user";

/*
 @description
 유저 닉네임 사이에 의미없는 유니코드를 삽입하여
 읽은사람 호출 안되게 파싱
 */
const filterReplyKeywordAlram = (readers: ChannelUserInfo[]) => {
  const textByReaders = readers.map((reader: ChannelUserInfo) => {
    let text = '';
    for (let i=0; i<reader.nickname.length; i++) {
      text += reader.nickname[i] + String.fromCharCode(8203)
    }
    return text;
  });
  return textByReaders;
}

/*
 @description
 답장시 읽은사람 확인
 */
export const replyEvent = (data: TalkChatData, channel: TalkChannel) => {
  const sender = data.getSenderInfo(channel);
  if (!sender) return;

  if (data.originalType === KnownChatType.REPLY && data.text === '!readers') {
    const reply = data.attachment<ReplyAttachment>();
    const logId = reply.src_logId;

    if (logId) {
      const readers = channel.getReaders({ logId });
      const readersText = filterReplyKeywordAlram(readers);
      channel.sendChat(`${logId} Readers (${readers.length})\n${readersText.join('\n')}`);
    }
  }
}
