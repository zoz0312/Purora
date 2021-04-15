import { EntityRepository, Repository } from "typeorm";
import { Keyword } from '../entities/keyword.entitiy';

@EntityRepository(Keyword)
export class KeywordRepository extends Repository<Keyword> {

}