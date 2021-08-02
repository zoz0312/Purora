import {CommandCoreEntity} from "src/common/entities/core.entities";
import { Column, Entity } from "typeorm";

/*
  @author AJu (zoz0312)
*/
@Entity()
export class AllowAdmin extends CommandCoreEntity {
  @Column()
  userId: number;

  @Column('longtext')
  description: string;
}