import { IsString, Min } from "class-validator";
import { CoreOutput } from "src/common/dtos/output.dto";

export class CreateUserInput {
  @IsString()
  @Min(5)
  userId: string;

  @IsString()
  userPw: string;

  @IsString()
  summonerName: string;
}

export class CreateUserOutput extends CoreOutput {

}