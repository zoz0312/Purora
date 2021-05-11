import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { UsersSummonerInfoRepository } from './repositories/users-summoner-info.repository';
import { UsersRepository } from './repositories/users.repository';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { JwtService } from './../jwt/jwt.service';
import { UserInfoOutput } from './dtos/user-info.dto';
import { regexId, regexPw } from './../../common/regex';
import { Users } from './entities/users.entity';
import { CreateSummonerInput, CreateSummonerOutput } from './dtos/create-summoner.dto';
import { regexMatch } from 'src/common/utils';
import { removeWhiteSpace } from './../../common/utils';
import { ModifyUserInput, ModifyUserOutput } from './dtos/modify-user.dto';
import {
  ReadMySummonerOutput,
  ReadOneSummonerOutput,
  ReadAllSummonerMatchOutput
} from './dtos/read-summoner.dto';
import {DeleteSummonerInput, DeleteSummonerOutput} from "./dtos/delete-summoner.dto";
import {ModifySummonerInput, ModifySummonerOutput} from "./dtos/modify-summoner.dto";

@Injectable()
export class UsersService {
  constructor(
    private readonly users: UsersRepository,
    private readonly usersSummonerInfo: UsersSummonerInfoRepository,
    private readonly jwtService: JwtService,
  ) {
  }

  async createUser (
    {
      userId,
      userPw,
      // summonerName,
      nickName,
    }: CreateUserInput,
  ): Promise<CreateUserOutput> {
    try {
      const matchId = regexMatch(userId, regexId);
      const matchPw = regexMatch(userPw, regexPw);

      if (!matchId) {
        throw new HttpException(`아이디는 영어와 숫자로만 가능합니다.`,
          HttpStatus.FORBIDDEN);
      }

      if (!matchPw) {
        throw new HttpException(`비밀번호는 영문과 숫자가 반드시 포함되어야 하고,\n특수문자까지 입력가능합니다.`,
          HttpStatus.FORBIDDEN)
      }

      const findUser = await this.users.findOne({
        where: {
          userId
        }
      });

      if (findUser) {
        return {
          success: false,
          message: `이미 생성된 ID 입니다`,
        }
      }

      const createdUser = await this.users.save(
        this.users.create({
          userId,
          userPw,
          nickName,
        })
      );

      // await this.usersSummonerInfo.save(
      //   this.usersSummonerInfo.create({
      //     user: createdUser,
      //     summonerName: removeWhiteSpace(summonerName),
      //   })
      // );

      return {
        success: true,
        message: `성공적으로 생성되었습니다.`,
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }
  }

  async modifyUser(
    authUser: Users,
    {
      nickName
    }: ModifyUserInput
  ): Promise<ModifyUserOutput> {
    try {
      authUser.nickName = nickName;
      await this.users.save(authUser);

      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }
  }

  async login(
    { userId, userPw }: LoginInput
  ): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({
        userId
      }, {
        select: ['id', 'userId', 'userPw', 'role', 'nickName']
      });

      if (!user) {
        return {
          success: false,
          message: `존재하지 않는 유저입니다! +_+`,
        }
      }

      const passwordCorrect = await user.checkPassword(userPw);
      if (!passwordCorrect) {
        return {
          success: false,
          message: `비밀번호를 다시 입력해주세요! O_o`,
        }
      }

      const token = this.jwtService.sign({ id: user.id });
      return {
        success: true,
        token,
        user: {
          id: user.id,
          userId: user.userId,
          role: user.role,
          nickName: user.nickName,
        }
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }
  }

  async readSAllummonerMatch(
  ): Promise<ReadAllSummonerMatchOutput> {
    try {
      const usersSummonerInfo = await this.usersSummonerInfo.find({
        select: ['id', 'summonerName', 'rating'],
        relations: ['usersGameInfo', 'user'],
        cache: true,
      });

      const parsedSummoner = usersSummonerInfo.map(user => {
        const reduced = user.usersGameInfo.reduce(({ win, lose }, cur) => {
          const isWin = cur.winStatus === 0;
          return {
            win: isWin ? win + 1 : win,
            lose: isWin ? lose : lose + 1,
          }
        }, { win: 0, lose: 0 });

        delete(user.usersGameInfo);

        return {
          user,
          ...reduced
        };
      });

      return {
        success: true,
        usersSummonerInfo: parsedSummoner,
      }
    } catch (error) {
      console.log('error', error);
      return {
        success: false,
        error,
      }
    }
  }

  async readOneSummoner(
    authUser: Users,
    id: number
  ): Promise<ReadOneSummonerOutput> {
    try {
      const summoner = await this.usersSummonerInfo.findOne({
        id
      }, {
        select: ['id', 'summonerName'],
        where: {
          user: authUser,
        }
      });

      if (!summoner) {
        return {
          success: false,
          message: `조회 권한이 없거나 존재하지 않는 소환사 입니다 ㅠ.ㅠ`,
        }
      }

      return {
        success: true,
        usersSummonerInfo: summoner,
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }
  }

  async readMySummoner(
    user: Users,
  ): Promise<ReadMySummonerOutput> {
    try {
      const mySummoner = await this.usersSummonerInfo.find({
        where: {
          user,
        },
      });

      return {
        success: true,
        usersSummonerInfo: mySummoner,
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }
    return {
      success: false
    }
  }

  async createSummoner(
    authUser: Users,
    createSummonerInput: CreateSummonerInput
  ): Promise<CreateSummonerOutput> {
    try {
      const user = await this.users.findOne(authUser.id, {
        relations: ['usersSummonerInfo']
      });

      if (!user) {
        return {
          success: false,
          message: `존재하지 않는 유저입니다! +_+`,
        }
      }

      const { summonerName: inputSummonerName } = createSummonerInput;
      const createSummonerName = removeWhiteSpace(inputSummonerName);

      for (let i=0; i<user.usersSummonerInfo.length; i++) {
        const {
          summonerName
        } = user.usersSummonerInfo[i];

        if (summonerName === createSummonerName) {
          return {
            success: false,
            message: `이미 존재하는 유저입니다 &_&`,
          }
        }
      }

      await this.usersSummonerInfo.save(
        this.usersSummonerInfo.create({
          user,
          summonerName: createSummonerName,
        })
      );
      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }
  }

    async modifySummoner(
    authUser: Users,
    { summonerId, summonerName }: ModifySummonerInput,
  ): Promise<ModifySummonerOutput> {
    try {
      const summoner = await this.usersSummonerInfo.findOne({
        where: {
          id: summonerId,
          user: authUser,
        }
      });

      if (!summoner) {
        return {
          success: false,
          message: `삭제 권한이 없거나 존재하지 않는 소환사 입니다 ㅠ.ㅠ`,
        }
      }

      if (summonerName) {
        summoner.summonerName = summonerName;
      }

      await this.usersSummonerInfo.save(summoner);

      return {
        success: true,
        message: `정상적으로 수정되었습니다!`,
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }
  }

  async deleteSummoner(
    authUser: Users,
    { summonerId }: DeleteSummonerInput,
  ): Promise<DeleteSummonerOutput> {
    try {
      const summoner = await this.usersSummonerInfo.findOne({
        where: {
          id: summonerId,
          user: authUser,
        }
      });

      if (!summoner) {
        return {
          success: false,
          message: `삭제 권한이 없거나 존재하지 않는 소환사 입니다 ㅠ.ㅠ`,
        }
      }

      await this.usersSummonerInfo.softDelete({
        id: summoner.id
      });

      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }
  }

  /* util functions */
  async findById(id: number): Promise<UserInfoOutput> {
    return this.users.findById(id);
  }
}
