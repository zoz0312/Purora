import { Injectable } from '@nestjs/common';
import { RiotCrawlerService } from './riot-crawler/riot-crawler.service';
import { GetRiotTokenInput, GetRiotTokenOutput } from './../dtos/get-riot-token.dto';

@Injectable()
export class PoroService {
  constructor (
    private readonly riotCrawlerService: RiotCrawlerService,
  ) {}

  async getRiotToken (
    getRiotTokenInput: GetRiotTokenInput
  ): Promise<GetRiotTokenOutput> {
    const { userId, userPw } = getRiotTokenInput;
    if (!userId || !userPw) {
      return {
        success: false,
        message: `ID또는 PW를 입력해주세요!`,
      }
    }

    return this.riotCrawlerService.getToken(getRiotTokenInput);
  }
}
