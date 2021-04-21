import { EntityRepository, Repository } from "typeorm";
import { Users } from "../entities/users.entitiy";
import { UserInfoOutput } from './../dtos/user-info.dto';

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {
  async findById(id: number): Promise<UserInfoOutput> {
    try {
      const user = await this.findOne({ id });
      return {
        success: true,
        user,
      }
    } catch(error) {
      return {
        success: false,
        error,
      }
    }
  }
}