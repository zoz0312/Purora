
import {CommandCoreEntity} from "src/common/entities/core.entities";
import { Column, Entity } from "typeorm";

/*
  @author AJu (zoz0312)
*/
@Entity()
export class AllowRoom extends CommandCoreEntity {
  @Column()
  roomId: number;

  @Column('longtext')
  description: string;
}