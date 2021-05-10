import {IsNumber} from "class-validator";
import {CoreOutput} from "../../../common/dtos/output.dto";

export class DeleteSummonerInput {
  @IsNumber()
  summonerId: number;
}

export class DeleteSummonerOutput extends CoreOutput {
}