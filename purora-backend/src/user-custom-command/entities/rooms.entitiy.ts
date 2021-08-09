import { type } from "os";
import {CommandCoreEntity, CoreEntity} from "src/common/entities/core.entities";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Keyword } from "./keyword.entitiy";

/*
  @author AJu (zoz0312)
  Commands: 방별로 구분 짓기 위한 Entitiy
*/
@Entity()
export class Rooms extends CommandCoreEntity {
  // @Column()
  @OneToMany(
    type => Keyword,
    keyword => keyword.rooms,
    {
      cascade: true,
      onDelete: 'CASCADE',
    }
  )
  keyword: Keyword[];

  @Column({
    type: "bigint"
  })
  roomId: number;

  @Column()
  roomName: string;
}