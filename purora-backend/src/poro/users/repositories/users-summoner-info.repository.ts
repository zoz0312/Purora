import { EntityRepository, Repository } from "typeorm";
import { UsersSummonerInfo } from '../entities/users-summoner-info.entity';
import { Users } from "../entities/users.entity";

@EntityRepository(UsersSummonerInfo)
export class UsersSummonerInfoRepository extends Repository<UsersSummonerInfo> {
  async findById ({
    summonerId,
    user,
  }: {
    summonerId: number,
    user: Users,
  }): Promise<UsersSummonerInfo> {
    return await this.findOne({
      where: {
        id: summonerId,
        user,
      }
    })
  }
}