import { Injectable } from '@nestjs/common';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { UsersGameInfoRepository } from './repositories/users-game-info.repository';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly users: UsersRepository,
    private readonly usersGameInfo: UsersGameInfoRepository,
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

      await this.usersGameInfo.save(
        this.usersGameInfo.create({
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
}
