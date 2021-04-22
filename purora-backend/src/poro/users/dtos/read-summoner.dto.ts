import { CoreOutput } from "src/common/dtos/output.dto";
import { Users } from "../entities/users.entitiy";
import { UsersSummonerInfo } from './../entities/users-summoner-info.entitiy';

// export class ReadAllSummonerInput {
// }

// export class ReadOneSummoner {
// }

export class ReadAllSummonerOutput extends CoreOutput {
  usersSummonerInfo?: UsersSummonerInfo[];
}

export class ReadOneSummonerOutput extends CoreOutput {
  usersSummonerInfo?: UsersSummonerInfo;
}