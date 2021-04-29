import { CoreEntity } from "src/common/entities/core.entities";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Users } from "./users.entitiy";

/*
  @author AJu (zoz0312)
  Commands: User lol
*/
@Entity()
export class UsersSummonerInfo extends CoreEntity {
  @ManyToOne(
    type => Users
  )
  user: Users;

  @RelationId(
    (usersSummonerInfo: UsersSummonerInfo) => usersSummonerInfo.user
  )
  userId: number;

  @Column({ length: 16 })
  summonerName: string;

  @Column('text')
  token: string;

  @Column()
  pvpId: number;
}