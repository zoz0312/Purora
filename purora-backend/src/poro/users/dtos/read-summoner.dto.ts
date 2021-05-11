import { CoreOutput } from "src/common/dtos/output.dto";
import { Users } from "../entities/users.entity";
import { UsersSummonerInfo } from '../entities/users-summoner-info.entity';

// export class ReadAllSummonerInput {
// }

// export class ReadOneSummoner {
// }

class SummonerMatchType {
  user: UsersSummonerInfo;
  win: number;
  lose: number;
};

export class ReadAllSummonerMatchOutput extends CoreOutput {
  usersSummonerInfo?: SummonerMatchType[];
}

export class ReadOneSummonerOutput extends CoreOutput {
  usersSummonerInfo?: UsersSummonerInfo;
}

export class ReadMySummonerOutput extends CoreOutput {
  usersSummonerInfo?: UsersSummonerInfo[];
}