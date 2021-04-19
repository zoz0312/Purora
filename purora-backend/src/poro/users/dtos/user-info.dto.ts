import { CoreOutput } from "src/common/dtos/output.dto";
import { Users } from './../entities/users.entitiy';

export class UserInfoOutput extends CoreOutput {
  user?: Users;
}