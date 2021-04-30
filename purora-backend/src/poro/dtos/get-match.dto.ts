import { CoreOutput } from "src/common/dtos/output.dto";
import { UsersGameInfo } from "../users/entities/user-game-info.entity";

export class GetMatchInput {
  beginIndex: string;
  endIndex: string;
}

export class GetMatchOutput extends CoreOutput {
  data?: UsersGameInfo[];
}