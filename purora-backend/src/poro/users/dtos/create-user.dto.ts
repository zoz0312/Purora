import { IsString, Matches, MaxLength, Min, MinLength, ValidateIf } from "class-validator";
import { CoreOutput } from "src/common/dtos/output.dto";

export class CreateUserInput {
  @IsString()
  @MinLength(5, {
    message: `아이디는 최소 5자 이상이어야 합니다.`
  })
  // @Matches(/^[A-Za-z0-9]*$/g, {
  //   message: `아이디는 영어와 숫자로만 가능합니다.`
  // })
  userId: string;

  @IsString()
  @MinLength(6, {
    message: `비밀번호는 최소 6자 이상입니다.`
  })
  @MaxLength(15, {
    message: `비밀번호는 최대 15자 까지입니다.`
  })
  // @Matches(/^(?=.*\d)(?=.*[a-z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]*$/g, {
  //   message: `비밀번호는 영문과 숫자가 반드시 포함되어야 하고,\n특수문자까지 입력가능합니다.`
  // })
  userPw: string;

  @IsString()
  summonerName: string;
}

export class CreateUserOutput extends CoreOutput {

}