import { CoreOutput } from "src/common/dtos/output.dto";
import { Users } from "src/poro/users/entities/users.entity";

export class AdminReadUsersOutput extends CoreOutput {
  users?: Users[];
}