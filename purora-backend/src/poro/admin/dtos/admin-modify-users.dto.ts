import { PartialType } from "@nestjs/swagger";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Users } from "src/poro/users/entities/users.entity";

export class AdminModifyUsersInput {
  users: Users[];
}

export class AdminModifyUsersOutput extends CoreOutput {
}