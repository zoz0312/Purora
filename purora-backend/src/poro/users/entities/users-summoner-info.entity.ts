import { CoreEntity } from "src/common/entities/core.entities";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId} from "typeorm";
import { Users } from "./users.entity";
import {UsersGameInfo} from "./user-game-info.entity";

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

  @OneToMany(
    type => UsersGameInfo,
    UsersGameInfo => UsersGameInfo.summoner,
    {
      cascade: true,
      onDelete: 'CASCADE',
    }
  )
  usersGameInfo: UsersGameInfo[];

  @Column({ length: 16 })
  summonerName: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  token: string;

  @Column({
    nullable: true,
  })
  pvpId: number;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  lastMatchUpdateAt: Date;

  @Column({
    type: 'int',
    default: 0,
  })
  rating: number;
}