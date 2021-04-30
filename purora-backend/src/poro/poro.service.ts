import { Injectable } from '@nestjs/common';
import { RiotCrawlerService } from './riot-crawler/riot-crawler.service';
import { GetRiotTokenInput, GetRiotTokenOutput } from './dtos/get-riot-token.dto';
import { GetMatchOutput } from './dtos/get-match.dto';
import { UsersRepository } from './users/repositories/users.repository';
import { GameInfoRepotitory } from './users/repositories/game-info.repotitory';
import { Users } from './users/entities/users.entity';
import { UsersGameInfoRepotitory } from './users/repositories/users-game-info.repository';
import { UsersSummonerInfoRepository } from './users/repositories/users-summoner-info.repository';
import { InitalizeMatchDataInput, InitalizeMatchDataOutput } from './users/dtos/initalize-match.data.dto';

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

  async getMatch (
    user: Users,
    id: number,
  ): Promise<GetMatchOutput> {
    if (isNaN(id)) {
      return {
        success: false,
        message: `잘못된 요청입니다.`,
      }
    }

    const summoner = await this.usersSummonerInfo.findOne({
      where:{
        id,
        user,
      }
    });

    if (!summoner) {
      return {
        success: false,
        message: `권한이 없거나 존재하지 않는 소환사입니다. O_o`,
      }
    }


    // TODO: GET Match Data From DB
    // if (!summoner.token || !summoner.pvpId) {
    //   return {
    //     success: false,
    //     message: 
    //   }
    // }

    const {
      data,
      error,
    } = await this.riotCrawlerService.getUserCustomMatch({
      id_token: `eyJraWQiOiJzMSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyMDljMDUxOC1mMGZhLTU4YjItOWE4Zi1jNzJkOWJlMzliNDEiLCJjb3VudHJ5Ijoia29yIiwicGxheWVyX3Bsb2NhbGUiOiJlbi1VUyIsImFtciI6WyJwYXNzd29yZCJdLCJpc3MiOiJodHRwczpcL1wvYXV0aC5yaW90Z2FtZXMuY29tIiwibG9sIjpbeyJjdWlkIjoyMDAxNjgyOTAsImNwaWQiOiJLUiIsInVpZCI6MjAwMTY4MjkwLCJ1bmFtZSI6InpvejAzMTIiLCJwdHJpZCI6bnVsbCwicGlkIjoiS1IiLCJzdGF0ZSI6IkVOQUJMRUQifV0sImxvY2FsZSI6ImtvX0tSIiwiYXVkIjoicnNvLXdlYi1jbGllbnQtcHJvZCIsImFjciI6InVybjpyaW90OmJyb256ZSIsInBsYXllcl9sb2NhbGUiOiJlbi1VUyIsImV4cCI6MTYxOTYxNzcxMywiaWF0IjoxNjE5NTMxMzEzLCJhY2N0Ijp7ImdhbWVfbmFtZSI6IuyXiSDrlJQiLCJ0YWdfbGluZSI6IktSMSJ9LCJqdGkiOiJpS2toUENWYzh5MCIsImxvZ2luX2NvdW50cnkiOiJrb3IifQ.YbtF5mDYmjTb8XOHPbrKBRsbjg3fzcKNAhxyjeW3zzcfl6apNtYwjkEydSPaefxDfk-_-sqsOHl_h32gM14_D1o2VYaFYbDLDos6iQn-3RWy4HH4BafUTwjfWspKFwdcxkOUKrgvSaZ9v4_HgJWJEhqdJ1BM2uONJCQffpoRwV4`,
      PVPNET_ID_KR: 200168290,
      beginIndex: 0,
      endIndex: 5,
    });
    return {
      success: true,
      data,
      error,
    }
  }

  async initalizeMatchDataInput (
    user: Users,
    {
      beginIndex,
      endIndex,
      summonerIndex,
    }: InitalizeMatchDataInput,
  ): Promise<InitalizeMatchDataOutput> {
    const summoner = await this.usersSummonerInfo.findOne({
      where:{
        id: summonerIndex,
        user,
      }
    });

    if (!summoner) {
      return {
        success: false,
        message: `존재하지 않거나 권한이 없는 소환사입니다. X_x`,
      }
    }

    /*
      TODO: 갱신 주기 컬럼 추가 및 갱신 딜레이 걸기
    */

    const {
      data,
      error,
    } = await this.riotCrawlerService.getUserCustomMatch({
      id_token: summoner.token,
      PVPNET_ID_KR: summoner.pvpId,
      beginIndex: 0,
      endIndex: 5,
    });

    if (!data) {
      return {
        success: false,
        message: '토큰 업데이트가 필요합니다.'
      }
    }

    const { games: { games } } = data;
    let gameInfoWhere = games.map(game => {
      return { gameId: game.gameId }
    });

    /* GameInfo DB 조회 */
    let dbGameInfo = await this.gameInfo.find({
      where: gameInfoWhere
    });

    /* JSON과 GameInfo DB를 비교하여 없는 GameInfo Insert */
    if (dbGameInfo.length !== gameInfoWhere.length) {
      const insertGameInfo = games.filter(game => {
        for (let dbGame of dbGameInfo) {
          if (dbGame.gameId === game.gameId) {
            return false;
          }
        }
        return true;
      }).map(({
        gameId,
        gameCreation: creation,
        gameDuration: duration,
        gameMode: mode,
        gameVersion: version,
      }) => ({
        gameId: +gameId,
        creation: +creation,
        duration,
        mode,
        version,
      }));

      await this.gameInfo.save(
        this.gameInfo.create(insertGameInfo)
      );

      dbGameInfo = await this.gameInfo.find({
        where: gameInfoWhere
      });
    }

    gameInfoWhere = dbGameInfo.map(gameInfo => ({
      gameInfo,
      users: user
    }));

    /* UsersGameInfo DB 조회 */
    const dbUserGameInfo = await this.usersGameInfo.find({
      where: gameInfoWhere
    });

    if (gameInfoWhere.length !== dbUserGameInfo.length) {
      const insertUsersGameInfo = gameInfoWhere.filter(gameInfo => {
        for (let dbUserGame of dbUserGameInfo) {
          if (dbUserGame.gameInfo === gameInfo) {
            return false;
          }
        }
        return true;
      }).map(({ gameInfo, users }) => {
        const [userGame] = games.filter(game => {
          return game.gameId === +gameInfo.gameId;
        });

        return {
          gameInfo,
          users,
          gameData: JSON.stringify({
            participants: userGame.participants[0],
            player: userGame.participantIdentities[0].player,
          })
        }
      });
      await this.usersGameInfo.save(
        this.usersGameInfo.create(insertUsersGameInfo)
      );
    }

    return {
      success: true,
      message: `성공적으로 갱신되었습니다! ᕕ( ᐛ )ᕗ `,
    }
  }
}
