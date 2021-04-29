import { Injectable } from '@nestjs/common';
import { RiotCrawlerService } from './riot-crawler/riot-crawler.service';
import { GetRiotTokenInput, GetRiotTokenOutput } from './dtos/get-riot-token.dto';
import { GetMatchOutput } from './dtos/get-match.dto';
import { UsersRepository } from './users/repositories/users.repository';
import { GameInfoRepotitory } from './users/repositories/game-info.repotitory';
import { Users } from './users/entities/users.entitiy';
import { UsersGameInfoRepotitory } from './users/repositories/users-game-info.repository';
import { UsersSummonerInfoRepository } from './users/repositories/users-summoner-info.repository';

@Injectable()
export class PoroService {
  constructor (
    private readonly riotCrawlerService: RiotCrawlerService,
    private readonly users: UsersRepository,
    private readonly gameInfo: GameInfoRepotitory,
    private readonly usersGameInfo: UsersGameInfoRepotitory,
    private readonly usersSummonerInfo: UsersSummonerInfoRepository,
  ) {}

  async getRiotToken (
    user: Users,
    getRiotTokenInput: GetRiotTokenInput
  ): Promise<GetRiotTokenOutput> {
    const { userId, userPw, summonerId } = getRiotTokenInput;
    if (!userId || !userPw) {
      return {
        success: false,
        message: `ID또는 PW를 입력해주세요!`,
      }
    }

    const summoner = await this.usersSummonerInfo.findOne({
      where:{
        id: summonerId,
        user,
      }
    });

    if (!summoner) {
      return {
        success: false,
        message: `권한이 없는 소환사 이름입니다 O_o`,
      }
    }

    const { error, keyList } = await this.riotCrawlerService.getToken({
      userId,
      userPw,
    });

    if (error) {
      return {
        success: false,
        error,
      }
    }

    if (keyList.length === 0) {
      return {
        success: false,
        message: `아이디 또는 비밀번호가 잘못되어 정보를 가져올 수 없습니다 ㅠ.ㅠ`,
      }
    }

    const cookie = {
      'PVPNET_ID_KR': 'pvpId',
      'id_token': 'token',
    }

    keyList.map(item => {
      summoner[cookie[item.name]] = item.value;
    });

    await this.usersSummonerInfo.save(summoner);

    return {
      success: true,
    }
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
