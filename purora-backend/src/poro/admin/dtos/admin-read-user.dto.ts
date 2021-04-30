import { CoreOutput } from "src/common/dtos/output.dto";
import { Users } from "src/poro/users/entities/users.entity";

export class AdminReadUserOutput extends CoreOutput {
  user?: Users;
}