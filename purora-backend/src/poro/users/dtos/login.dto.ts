import { IsString, Min } from "class-validator";
import { CoreOutput } from "src/common/dtos/output.dto";

export class LoginInput {
  @IsString()
  userId: string;

  @IsString()
  userPw: string;
}

export class LoginOutput extends CoreOutput {
  @IsString()
  token?: string;
}