import { PartialType, PickType } from "@nestjs/swagger";
import { CoreOutput } from "src/common/dtos/output.dto";
import { CreateUserInput } from "./create-user.dto";

export class ModifyUserInput extends PartialType(
  PickType(CreateUserInput, ['nickName'] as const)
) {

}

export class ModifyUserOutput extends CoreOutput {}