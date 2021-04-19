import { CoreEntity } from "src/common/entities/core.entities";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { IsEnum, IsString } from 'class-validator';
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
  users: Users;

  @RelationId(
    (usersSummonerInfo: UsersSummonerInfo) => usersSummonerInfo.users
  )
  userId: number;

  @Column()
  @IsString()
  summonerName: string;
}