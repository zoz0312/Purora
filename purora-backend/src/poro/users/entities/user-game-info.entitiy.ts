import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { CoreEntity } from 'src/common/entities/core.entities';
import { GameInfo } from "./game-info.entitiy";
import { Users } from "./users.entitiy";

@Entity()
export class UsersGameInfo extends CoreEntity {
  @ManyToOne(
    type => GameInfo
  )
  gameInfo: GameInfo;

  @RelationId(
    (UsersGameInfo: UsersGameInfo) => UsersGameInfo.gameInfo
  )
  gameId: number;

  @ManyToOne(
    type => Users
  )
  users: Users;

  @RelationId(
    (UsersGameInfo: UsersGameInfo) => UsersGameInfo.users
  )
  userId: number;

  @Column('longtext')
  gameData: string;
}