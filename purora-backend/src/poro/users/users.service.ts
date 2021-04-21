import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { UsersSummonerInfoRepository } from './repositories/users-summoner-info.repository';
import { UsersRepository } from './repositories/users.repository';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { JwtService } from './../jwt/jwt.service';
import { UserInfoOutput } from './dtos/user-info.dto';
import { regexId, regexPw } from './../../common/regex';

@Injectable()
export class UsersService {
  constructor(
    private readonly users: UsersRepository,
    private readonly usersSummonerInfoInfo: UsersSummonerInfoRepository,
    private readonly jwtService: JwtService,
  ) {
  }

  async createUser (
    { userId, userPw, summonerName }: CreateUserInput,
  ): Promise<CreateUserOutput> {
    try {
      const matchId = userId.match(regexId);
      const matchPw = userPw.match(regexPw);

      if (matchId === null || matchId[0].length === 0) {
        throw new HttpException(`아이디는 영어와 숫자로만 가능합니다.`,
          HttpStatus.FORBIDDEN);
      }

      if (matchPw === null || matchPw[0].length === 0) {
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
        })
      );

      await this.usersSummonerInfoInfo.save(
        this.usersSummonerInfoInfo.create({
          users: createdUser,
          summonerName
        })
      );

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

  async login(
    { userId, userPw }: LoginInput
  ): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({
        userId
      }, {
        select: ['id', 'userPw']
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
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }
  }

  async findById(id: number): Promise<UserInfoOutput> {
    return this.users.findById(id);
  }
}
