import { Column, Entity, OneToMany } from "typeorm";
import { CoreEntity } from 'src/common/entities/core.entities';
import { UsersGameInfo } from "./user-game-info.entity";

@Entity()
export class GameInfo extends CoreEntity {
  @Column({
    type: 'bigint',
  })
  gameId: number;

  @Column({
    type: 'bigint',
  })
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

  @Column({
    type: 'tinyint',
    comment: '1: blueWin, 2: redWin',
    default: 1,
  })
  winStatus: number;
}