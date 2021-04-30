import { Injectable } from '@nestjs/common';
import { KeywordRepository } from 'src/user-custom-command/repositories/keyword.repository';
import { Users } from '../users/entities/users.entity';
import { UsersSummonerInfoRepository } from '../users/repositories/users-summoner-info.repository';
import { UsersRepository } from '../users/repositories/users.repository';
import { AdminModifyUsersInput, AdminModifyUsersOutput } from './dtos/admin-modify-users.dto';
import { AdminReadKeywordOutput } from './dtos/admin-read-keyword.dto';
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

  async modifyUsers(
    user: Users,
    { users }: AdminModifyUsersInput,
  ): Promise<AdminModifyUsersOutput> {
    if (users.length === 0) {
      return {
        success: false,
        message: `수정할 유저의 정보가 없습니다. (｡•́︿•̀｡)`
      }
    }

    try {
      const currentUsers = await this.users.find({
        where: users.map(user => ({ id: user.id }))
      });

      const updateUsers = currentUsers.map(currentUser => {
        for (const modifyUser of users) {
          if (currentUser.id === modifyUser.id) {
            return {
              ...currentUser,
              ...modifyUser
            }
          }
        }
        return {
          ...currentUser
        }
      })

      await this.users.save(updateUsers);

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

  async readUserKeywords (
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

  async readUserKeyword (
    user: Users,
    keywordId: number,
  ): Promise<AdminReadKeywordOutput> {
    try {
      const command = await this.keywordRepository.findOne({
        where: {
          id: keywordId,
        },
        relations: ['commands']
      });

      return {
        success: true,
        data: command,
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }
  }
}
