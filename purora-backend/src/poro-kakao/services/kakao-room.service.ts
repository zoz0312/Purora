import {Injectable} from "@nestjs/common";
import {ChatBotInput, ChatBotOutput} from "../../common/dtos/chatBot.dto";
import {
  KAKAO_ADD_ROOM, KAKAO_DELETE_ROOM,
  KAKAO_GET_CHANNEL_ID,
} from "../../command-manager/command-manager.constants";
import {AllowRoomRepository} from "../repositories/allow-room.repository";

@Injectable()
export class KakaoRoomService {
  constructor(
    private readonly allowRoomRepository: AllowRoomRepository,
  ) {}

  async mainService(
    chatBotInput :ChatBotInput,
    name: string,
  ): Promise<ChatBotOutput> {
    switch (name) {
      case KAKAO_GET_CHANNEL_ID:
        return this.getChannelId(chatBotInput);
      case KAKAO_ADD_ROOM:
        return this.addRoom(chatBotInput);
      case KAKAO_DELETE_ROOM:
        return this.deleteRoom(chatBotInput);
      default:
        return {
          success: false,
          message: `${name}은 잘못 되었습니다.`
        }
    }
  }

  async getChannelId (
    { talkChannel }: ChatBotInput,
  ): Promise<ChatBotOutput> {
    const message = String(+talkChannel.store.info.channelId);
    return {
      message,
      success: true,
    }
  }

  async addRoom (
    { talkChannel }: ChatBotInput,
  ): Promise<ChatBotOutput> {
    const roomId = +talkChannel.store.info.channelId;
    const roomName = talkChannel.getDisplayName();

    try {
      const alreadyRoom = await this.allowRoomRepository.findOne({
        where: {
          roomId
        }
      });

      if (alreadyRoom) {
        return {
          success: false,
          message: `"${roomName}"는 이미 등록된 방입니다.`
        }
      }

      await this.allowRoomRepository.save(
        this.allowRoomRepository.create({
          roomId,
          description: `${roomName}`,
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

  async deleteRoom (
    { talkChannel }: ChatBotInput,
  ): Promise<ChatBotOutput> {
    const roomId = +talkChannel.store.info.channelId;
    const roomName = talkChannel.getDisplayName();
    try {
      const alreadyRoom = await this.allowRoomRepository.findOne({
        where: {
          roomId
        }
      });

      if (!alreadyRoom) {
        return {
          success: false,
          message: `등록되지 않은 방입니다.`
        }
      }

      await this.allowRoomRepository.softDelete(alreadyRoom.id);

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
}