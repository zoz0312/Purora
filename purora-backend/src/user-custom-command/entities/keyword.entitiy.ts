import { CoreEntity } from "src/common/entities/core.entities";
import { Column, Entity, ManyToOne, OneToMany, RelationId } from "typeorm";
import { Commands } from "./commands.entitiy";
import { Rooms } from "./rooms.entitiy";

/*
  @author AJu (zoz0312)
  Keyword: 공통된 Keyword를 위한 Table
*/
@Entity()
export class Keyword extends CoreEntity {
  @Column()
  keyword: string;

  @ManyToOne(
    type => Rooms,
  )
  rooms: Rooms;

  @RelationId(
    (keyword: Keyword) => keyword.rooms
  )
  roomId: number;

  // @Column({ array: true })
  @OneToMany(
    type => Commands,
    commands => commands.keyword,
    {
      cascade: true,
      onDelete: 'CASCADE',
    }
  )
  commands: Commands[];
}