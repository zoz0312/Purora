import { IsString, Matches, MaxLength, Min, MinLength, ValidateIf } from "class-validator";
import { CoreOutput } from "src/common/dtos/output.dto";

export class CreateUserInput {
  @IsString()
  @MinLength(5, {
    message: `아이디는 최소 5자 이상이어야 합니다.`
  })
  userId: string;

  @IsString()
  @MinLength(6, {
    message: `비밀번호는 최소 6자 이상입니다.`
  })
  @MaxLength(15, {
    message: `비밀번호는 최대 15자 까지입니다.`
  })
  userPw: string;

  @IsString()
  nickName: string;

  @IsString()
  summonerName: string;
}

export class CreateUserOutput extends CoreOutput {

}