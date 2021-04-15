import { CoreEntity } from "src/common/entities/core.entities";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { IsEnum } from 'class-validator';

export enum Status {
  Todo = 'TODO',
  Working = 'WORKING',
  Done = 'DONE',
}

/*
  @author AJu (zoz0312)
  룽지님 작업자 상태
*/
@Entity()
export class Working extends CoreEntity {
  @Column()
  userName: string;

  @Column()
  champion: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Todo
  })
  @IsEnum(Status)
  status: Status;
}