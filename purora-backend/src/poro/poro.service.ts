import { Injectable } from '@nestjs/common';
import { RiotCrawlerService } from './riot-crawler/riot-crawler.service';
import { GetRiotTokenInput, GetRiotTokenOutput } from './dtos/get-riot-token.dto';
import { GetMatchInput, GetMatchOutput } from './dtos/get-match.dto';
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

    const summoner = await this.usersSummonerInfo.findById({
      summonerId,
      user,
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

  async getMatchData (
    user: Users,
    summonerId: number,
    query: GetMatchInput,
  ): Promise<GetMatchOutput> {

    const summoner = await this.usersSummonerInfo.findById({
      summonerId,
      user,
    });

    if (!summoner) {
      return {
        success: false,
        message: `권한이 없거나 존재하지 않는 소환사입니다. O_o`,
      }
    }

    const skip = +query.beginIndex;
    const take = (+query.endIndex) - skip;

    if (isNaN(skip) || isNaN(take)) {
      return {
        success: false,
        message: `잘못된 Query 요청입니다 ˃̣̣̣̣̣̣︿˂̣̣̣̣̣̣ `,
      }
    }

    try {
      const data = await this.usersGameInfo.find({
        select: ['gameData'],
        where: {
          users: user
        },
        skip,
        take
      });

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
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

    if (summoner.lastMatchUpdateAt) {
      const updateCyle = 1 * 60 * 1000 // 1분
      const lastTime = new Date(summoner.lastMatchUpdateAt).getTime() + updateCyle;
      const currentTime = new Date().getTime();

      if (lastTime > currentTime) {
        const time = Math.floor((lastTime - currentTime) / 1000);
        return {
          success: false,
          message: `${time}초 후에 갱신 가능합니다.. (｡•́︿•̀｡)`,
        }
      }
    }

    let flag = false;
    const {
      data,
      error,
    } = await this.riotCrawlerService.getUserCustomMatch({
      id_token: summoner.token,
      PVPNET_ID_KR: summoner.pvpId,
      beginIndex,
      endIndex,
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
      flag = true;
      const insertGameInfo = games.filter(game => {
        for (let dbGame of dbGameInfo) {
          if (+dbGame.gameId === game.gameId) {
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
        gameId: gameId,
        creation: creation,
        duration,
        mode,
        version,
      }));

      const newGameInfo = await this.gameInfo.save(
        this.gameInfo.create(insertGameInfo)
      );

      dbGameInfo = [
        ...newGameInfo,
        ...dbGameInfo
      ];
    }

    /* UsersGameInfo 조회를 위한 조건문 Update */
    gameInfoWhere = dbGameInfo.map(gameInfo => ({
      gameInfo,
      users: user
    }));


    /* UsersGameInfo DB 조회 */
    const dbUserGameInfo = await this.usersGameInfo.find({
      where: gameInfoWhere
    });


    /*
     * UsersGameData와 크롤링한 데이터의 길이가 다른 경우,
     * DB에 없는 데이터 Insert
     */
    if (gameInfoWhere.length !== dbUserGameInfo.length) {
      flag = true;
      const insertUsersGameInfo = gameInfoWhere.filter(gameInfo => {
        for (let dbUserGame of dbUserGameInfo) {
          if (dbUserGame.gameId === gameInfo.gameInfo.id) {
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

    summoner.lastMatchUpdateAt = new Date();
    await this.usersSummonerInfo.save(summoner);

    if (!flag) {
      return {
        success: true,
        message: `이미 최신 상태입니다! ◝(・ω・)◟`,
      }
    }

    return {
      success: true,
      message: `성공적으로 갱신되었습니다! ᕕ( ᐛ )ᕗ`,
    }
  }
}
