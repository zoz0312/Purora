import { IsString } from "class-validator";
import { CoreOutput } from "src/common/dtos/output.dto";

export class GetTokenInput {
  @IsString()
  userId: string;

  @IsString()
  userPw: string;
}

export class GetTokenOutput extends CoreOutput {
  @IsString()
  keyList?: {
    key: string;
    value: string;
    domain: string;
  }[];
}