import { CoreOutput } from "src/common/dtos/output.dto";

export class CreateUserInput {
  userId: string;
  userPw: string;
  summonerName: string;
}

export class CreateUserOutput extends CoreOutput {

}