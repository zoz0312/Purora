import { EntityRepository, Repository } from "typeorm";
import { UsersGameInfo } from '../entities/users-game-info.entitiy';

@EntityRepository(UsersGameInfo)
export class UsersGameInfoRepository extends Repository<UsersGameInfo> {

}