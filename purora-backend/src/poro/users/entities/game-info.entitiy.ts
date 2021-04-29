import { Column, Entity, OneToMany } from "typeorm";
import { CoreEntity } from 'src/common/entities/core.entities';
import { UsersGameInfo } from "./user-game-info.entitiy";

@Entity()
export class GameInfo extends CoreEntity {
  @Column()
  gameId: number;

  @Column()
  creation: number;

  @Column()
  duration: number;

  @Column({ length: 15 })
  mode: string;

  @Column({ length: 15 })
  version: string;

  @OneToMany(
    type => UsersGameInfo,
    UsersGameInfo => UsersGameInfo.gameInfo,
    {
      cascade: true,
      onDelete: 'CASCADE',
    }
  )
  UsersGameInfo: UsersGameInfo[];
}