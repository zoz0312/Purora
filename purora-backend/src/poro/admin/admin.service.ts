import { Injectable } from '@nestjs/common';
import { KeywordRepository } from 'src/user-custom-command/repositories/keyword.repository';
import { Users } from '../users/entities/users.entity';
import { UsersSummonerInfoRepository } from '../users/repositories/users-summoner-info.repository';
import { UsersRepository } from '../users/repositories/users.repository';
import { AdminReadKeywordsOutput } from './dtos/admin-read-keywords.dto';
import { AdminReadUserOutput } from './dtos/admin-read-user.dto';
import { AdminReadUsersOutput } from './dtos/admin-read-users.dto';

@Injectable()
export class AdminService {
  constructor (
    private readonly users: UsersRepository,
    private readonly usersSummonerInfo: UsersSummonerInfoRepository,
    private readonly keywordRepository: KeywordRepository,
  ) {}

  async readUsers(
    user: Users,
  ): Promise<AdminReadUsersOutput> {
    try {
      const users = await this.users.find({
        select: [
          'id',
          'createdAt',
          'updatedAt',
          'nickName',
          'status',
          'role',
          'userId',
        ],
        relations: ['usersSummonerInfo'],
      });

      return {
        success: true,
        data: users,
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }
  }

  async readUser(
    user: Users,
    userId: number,
  ): Promise<AdminReadUserOutput> {
    try {
      const user = await this.users.findOne({
        where: {
          id: userId,
        },
        select: [
          'id',
          'createdAt',
          'updatedAt',
          'nickName',
          'status',
          'role',
          'userId',
        ],
        relations: ['usersSummonerInfo'],
      });

      return {
        success: true,
        data: user,
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }
  }

  async readUserCommand (
    user: Users,
  ): Promise<AdminReadKeywordsOutput> {
    try {
      const commands = await this.keywordRepository.find({
        relations: ['commands']
      });

      return {
        success: true,
        data: commands,
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }
  }
}
