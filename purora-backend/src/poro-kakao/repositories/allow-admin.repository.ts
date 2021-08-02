import { EntityRepository, Repository } from "typeorm";
import {AllowAdmin} from "../entities/allow-admin.entity";

@EntityRepository(AllowAdmin)
export class AllowAdminRepository extends Repository<AllowAdmin> {
}