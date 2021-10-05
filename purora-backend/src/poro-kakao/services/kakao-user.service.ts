import {Injectable} from "@nestjs/common";
import {ChatBotInput, ChatBotOutput} from "../../common/dtos/chatBot.dto";
import {TalkChatData} from "node-kakao/dist/talk/chat";
import {TalkChannel} from "node-kakao/dist/talk/channel";
import {
  KAKAO_ADD_USER_ID, KAKAO_ALL_MENTION,
  KAKAO_DELETE_USER_ID, KAKAO_READERS,
  KAKAO_USER_GET_ID
} from "../../command-manager/command-manager.constants";
import {ChatBuilder, KnownChatType, MentionContent, ReplyAttachment, ReplyContent} from "node-kakao";
import {AllowAdminRepository} from "../repositories/allow-admin.repository";
import {ChannelUserInfo} from "node-kakao/dist/user";

@Injectable()
export class KakaoUserService {
  constructor(
    private readonly allowAdminRepository: AllowAdminRepository,
  ) {
  }

  async mainService(
    chatBotInput :ChatBotInput,
    name: string,
  ): Promise<ChatBotOutput> {
    switch (name) {
      case KAKAO_USER_GET_ID:
        return this.getUserId(chatBotInput);
      case KAKAO_ADD_USER_ID:
        return this.addUserId(chatBotInput);
      case KAKAO_DELETE_USER_ID:
        return this.deleteUserId(chatBotInput);
      case KAKAO_ALL_MENTION:
        return this.allMention(chatBotInput);
      case KAKAO_READERS:
        return this.readers(chatBotInput);
      default:
        return {
          success: false,
          message: `${name}은 잘못 되었습니다.`
        }
    }
  }

  async getUserId (
    { talkChatData, kakaoSender }: ChatBotInput,
  ): Promise<ChatBotOutput> {
    let message = String(kakaoSender.userId);
    if (talkChatData.originalType === KnownChatType.REPLY) {
      const reply = talkChatData.attachment<ReplyAttachment>();
      message = String(reply.src_userId);
    }
    return {
      message,
      success: true,
    }
  }

  async addUserId (
    { talkChatData, kakaoSender, sender }: ChatBotInput,
  ): Promise<ChatBotOutput> {
    let userId = kakaoSender.userId;
    const addUser = sender;
    if (talkChatData.originalType === KnownChatType.REPLY) {
      const reply = talkChatData.attachment<ReplyAttachment>();
      userId = +reply.src_userId;
    }
    try {
      const alreadyUser = await this.allowAdminRepository.findOne({
        where: {
          userId,
        }
      });

      if (alreadyUser) {
        return {
          success: false,
          message: `'${userId}'는 이미 등록되어있습니다.`
        }
      }

      await this.allowAdminRepository.save(
        this.allowAdminRepository.create({
          userId,
          description: `등록자: ${addUser}`
        })
      );

      return {
        success: true,
        message: `정상적으로 등록되었습니다.`
      }
    } catch (e) {
      return {
        success: false,
        message: e,
      }
    }
  }

  async deleteUserId(
    { talkChatData }: ChatBotInput,
  ): Promise<ChatBotOutput> {
    if (talkChatData.originalType !== KnownChatType.REPLY) {
      return {
        success: false,
        message: `본인은 삭제할 수 없습니다.`,
      }
    }
    const reply = talkChatData.attachment<ReplyAttachment>();
    const userId = +reply.src_userId;
    try {
      const alreadyUser = await this.allowAdminRepository.findOne({
        where: {
          userId,
        }
      });

      if (!alreadyUser) {
        return {
          success: false,
          message: `삭제할 유저가 존재하지 않습니다.`,
        }
      }

      await this.allowAdminRepository.softDelete(alreadyUser.id);

      return {
        success: true,
        message: `성공적으로 삭제되었습니다.`,
      }
    } catch (e) {
      return {
        success: false,
        message: e,
      }
    }
  }

  async allMention (
    { talkChatData, talkChannel }: ChatBotInput,
  ): Promise<ChatBotOutput> {
    const allUser = talkChannel.getAllUserInfo();
    const builders = [];
    const MAX_MENTION_COUNT = 15;
    let count = 0;

    let builder = null;
    for (const user of allUser) {
      if (count === 0) {
        builder = new ChatBuilder()
          .append(new ReplyContent(talkChatData.chat));
      }
      builder.append(new MentionContent(user));
      count++;
      if (count === MAX_MENTION_COUNT - 1) {
        builders.push(builder);
        count = 0;
      }
    }

    if (count != 0) {
      builders.push(builder);
    }

    builders.map((builder) => {
      talkChannel.sendChat(builder.build(KnownChatType.REPLY));
    })

    return {
      success: true,
      message: `모두들 봐주세요!`,
    }
  }

  /*
   @description
   답장시 읽은사람 확인
 */
  async readers (
    { talkChatData, talkChannel }: ChatBotInput,
  ): Promise<ChatBotOutput> {
    const sender = talkChatData.getSenderInfo(talkChannel);
    if (!sender) return;

    if (talkChatData.originalType === KnownChatType.REPLY) {
      const reply = talkChatData.attachment<ReplyAttachment>();
      const logId = reply.src_logId;

      if (logId) {
        const readers = talkChannel.getReaders({ logId });
        const readersText = this.filterReplyKeywordAlram(readers);

        talkChannel.sendChat(`읽은사람 (${readers.length})\n${readersText.join('\n')}`);
      }
    }

    return {
      success: true,
    }
  }

  /*
   @description
   유저 닉네임 사이에 의미없는 유니코드를 삽입하여
   읽은사람 호출 안되게 파싱
  */
  filterReplyKeywordAlram = (readers: ChannelUserInfo[]) => {
    const textByReaders = readers.map((reader: ChannelUserInfo) => {
      let text = '';
      for (let i=0; i<reader.nickname.length; i++) {
        text += reader.nickname[i] + String.fromCharCode(8203)
      }
      return text;
    });
    return textByReaders;
  }
}