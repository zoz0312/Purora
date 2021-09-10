import {Body, Controller, Get, Post} from '@nestjs/common';
import {PoroKakaoService} from "./poro-kakao.service";
import {ChatBotInput, ChatBotOutput} from "../common/dtos/chatBot.dto";

@Controller('poro-kakao')
export class PoroKakaoController {
  constructor(
    private poroKakaoService: PoroKakaoService,
  ) {}

  @Get()
  async commandManage(): Promise<ChatBotOutput> {
    try {
      return await this.poroKakaoService.login();
    } catch (e) {
      return {
        success: false,
        message: `Login 실패! ${e}`
      }
    }
  }
}
