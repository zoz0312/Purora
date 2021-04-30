import { EntityRepository, Repository } from "typeorm";
import { UsersGameInfo } from "../entities/user-game-info.entity";

@EntityRepository(UsersGameInfo)
export class UsersGameInfoRepotitory extends Repository<UsersGameInfo> {
}