import { IsString, Min, MinLength } from "class-validator";
import { CoreOutput } from "src/common/dtos/output.dto";

export class CreateUserInput {
  @IsString()
  @MinLength(5, {
    message: 'ID는 최소 5자 이상이어야 합니다.'
  })
  userId: string;

  @IsString()
  userPw: string;

  @IsString()
  summonerName: string;
}

export class CreateUserOutput extends CoreOutput {

}