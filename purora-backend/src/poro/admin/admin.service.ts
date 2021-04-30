import { Injectable } from '@nestjs/common';
import { Users } from '../users/entities/users.entity';
import { UsersSummonerInfoRepository } from '../users/repositories/users-summoner-info.repository';
import { UsersRepository } from '../users/repositories/users.repository';
import { AdminReadUserOutput } from './dtos/admin-read-user.dto';
import { AdminReadUsersOutput } from './dtos/admin-read-users.dto';

@Injectable()
export class AdminService {
  constructor (
    private readonly users: UsersRepository,
    private readonly usersSummonerInfo: UsersSummonerInfoRepository,
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
        users,
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
        user,
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }
  }
}
