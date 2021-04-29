import { EntityRepository, Repository } from "typeorm";
import { UsersGameInfo } from "../entities/user-game-info.entitiy";

@EntityRepository(UsersGameInfo)
export class UsersGameInfoRepotitory extends Repository<UsersGameInfo> {
}