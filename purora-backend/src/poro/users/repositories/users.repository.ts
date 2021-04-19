import { EntityRepository, Repository } from "typeorm";
import { Users } from "../entities/users.entitiy";

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {
  async checkPassword(aPassword: string): Promise<boolean> {
    return this.checkPassword(aPassword);
  }
}