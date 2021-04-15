import { EntityRepository, Repository } from "typeorm";
import { Working } from "../entities/working.entity";

@EntityRepository(Working)
export class WorkingRepository extends Repository<Working> {

}