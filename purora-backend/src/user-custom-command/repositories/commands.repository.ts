import { EntityRepository, Repository } from "typeorm";
import { Commands } from '../entities/commands.entitiy';

@EntityRepository(Commands)
export class CommandsRepository extends Repository<Commands> {

}