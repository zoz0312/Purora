import { CoreOutput } from "src/common/dtos/output.dto";
import { UsersSummonerInfo } from './../entities/users-summoner-info.entitiy';

export class ReadAllSummonerInput {
}

export class ReadAllSummonerOutput extends CoreOutput {
  usersSummonerInfo?: UsersSummonerInfo[];
}