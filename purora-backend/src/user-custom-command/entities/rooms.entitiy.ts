import { type } from "os";
import { CoreEntity } from "src/common/entities/core.entities";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Keyword } from "./keyword.entitiy";

/*
  @author AJu (zoz0312)
  Commands: 방별로 구분 짓기 위한 Entitiy
*/
@Entity()
export class Rooms extends CoreEntity {
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

  @Column()
  roomName: string;
}