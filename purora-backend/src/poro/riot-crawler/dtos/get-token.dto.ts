import { IsString } from "class-validator";
import { CoreOutput } from "src/common/dtos/output.dto";

export class GetTokenInput {
  @IsString()
  userId: string;

  @IsString()
  userPw: string;
}

export class GetTokenOutput {
  @IsString()
  keyList?: {
    name: string;
    value: string;
    domain: string;
  }[];

  @IsString()
  error?: string;
}