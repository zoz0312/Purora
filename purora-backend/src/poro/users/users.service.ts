import { Injectable } from '@nestjs/common';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { UsersSummonerInfoRepository } from './repositories/users-summoner-info.repository';
import { UsersRepository } from './repositories/users.repository';
import { LoginInput, LoginOutput } from './dtos/login.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly users: UsersRepository,
    private readonly usersSummonerInfoInfo: UsersSummonerInfoRepository,
  ) {
  }

  async createUser (
    { userId, userPw, summonerName }: CreateUserInput,
  ): Promise<CreateUserOutput> {
    try {
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

      const passwordCorrect = await this.users.checkPassword(userPw);
      if (!passwordCorrect) {
        return {
          success: false,
          message: `비밀번호를 다시 입력해주세요! O_o`,
        }
      }

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
}
