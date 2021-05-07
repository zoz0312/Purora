import { CoreOutput } from "src/common/dtos/output.dto";
import { UsersGameInfo } from "../users/entities/user-game-info.entity";
import {GameInfo} from "../users/entities/game-info.entity";

export class ReadMatchInput {
  beginIndex: string;
  endIndex: string;
}

export class ReadMatchAllOutput extends CoreOutput {
  data?: GameInfo[];
  totalLength?: number;
}

export class ReadMatchUsersOutput extends CoreOutput {
  data?: UsersGameInfo[];
  totalLength?: number;
}

export class ReadMatchSummonerOutput extends CoreOutput {
  data?: UsersGameInfo[];
  totalLength?: number;
}
