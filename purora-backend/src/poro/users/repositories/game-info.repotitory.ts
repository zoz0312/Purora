import { EntityRepository, Repository } from "typeorm";
import { GameInfo } from "../entities/game-info.entitiy";

@EntityRepository(GameInfo)
export class GameInfoRepotitory extends Repository<GameInfo> {
}