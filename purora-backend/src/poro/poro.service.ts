import { Injectable } from '@nestjs/common';
import { RiotCrawlerService } from './riot-crawler/riot-crawler.service';
import { GetRiotTokenInput, GetRiotTokenOutput } from './dtos/get-riot-token.dto';
import { GetMatchOutput } from './dtos/get-match.dto';

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

  async getMatch (): Promise<GetMatchOutput> {
    const {
      data,
      error,
    } = await this.riotCrawlerService.getUserCustomMatch({
      id_token: `eyJraWQiOiJzMSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyMDljMDUxOC1mMGZhLTU4YjItOWE4Zi1jNzJkOWJlMzliNDEiLCJjb3VudHJ5Ijoia29yIiwicGxheWVyX3Bsb2NhbGUiOiJlbi1VUyIsImFtciI6WyJwYXNzd29yZCJdLCJpc3MiOiJodHRwczpcL1wvYXV0aC5yaW90Z2FtZXMuY29tIiwibG9sIjpbeyJjdWlkIjoyMDAxNjgyOTAsImNwaWQiOiJLUiIsInVpZCI6MjAwMTY4MjkwLCJ1bmFtZSI6InpvejAzMTIiLCJwdHJpZCI6bnVsbCwicGlkIjoiS1IiLCJzdGF0ZSI6IkVOQUJMRUQifV0sImxvY2FsZSI6ImtvX0tSIiwiYXVkIjoicnNvLXdlYi1jbGllbnQtcHJvZCIsImFjciI6InVybjpyaW90OmJyb256ZSIsInBsYXllcl9sb2NhbGUiOiJlbi1VUyIsImV4cCI6MTYxOTYxNzcxMywiaWF0IjoxNjE5NTMxMzEzLCJhY2N0Ijp7ImdhbWVfbmFtZSI6IuyXiSDrlJQiLCJ0YWdfbGluZSI6IktSMSJ9LCJqdGkiOiJpS2toUENWYzh5MCIsImxvZ2luX2NvdW50cnkiOiJrb3IifQ.YbtF5mDYmjTb8XOHPbrKBRsbjg3fzcKNAhxyjeW3zzcfl6apNtYwjkEydSPaefxDfk-_-sqsOHl_h32gM14_D1o2VYaFYbDLDos6iQn-3RWy4HH4BafUTwjfWspKFwdcxkOUKrgvSaZ9v4_HgJWJEhqdJ1BM2uONJCQffpoRwV4`,
      PVPNET_ID_KR: `200168290`,
    });
    return {
      success: true,
      data,
      error,
    }
  }
}
