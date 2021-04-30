import { EntityRepository, Repository } from "typeorm";
import { UsersSummonerInfo } from '../entities/users-summoner-info.entity';

@EntityRepository(UsersSummonerInfo)
export class UsersSummonerInfoRepository extends Repository<UsersSummonerInfo> {

}