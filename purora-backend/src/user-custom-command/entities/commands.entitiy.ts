import { type } from "os";
import { CoreEntity } from "src/common/entities/core.entities";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Keyword } from "./keyword.entitiy";

/*
  @author AJu (zoz0312)
  Commands: 키워드에 맞는 outputText를 보내기 위한 Table
*/
@Entity()
export class Commands extends CoreEntity {
  @Column({ type: 'longtext' })
  outputText: string;

  // @Column()
  @ManyToOne(
    type => Keyword
  )
  keyword: Keyword;

  @RelationId(
    (command: Commands) => command.keyword
  )
  keywordId: number;

  @Column()
  userName: string;
}