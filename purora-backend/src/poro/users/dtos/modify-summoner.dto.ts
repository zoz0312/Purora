import {IsNumber} from "class-validator";
import {CoreOutput} from "../../../common/dtos/output.dto";
import {PartialType} from "@nestjs/swagger";
import {CreateSummonerInput} from "./create-summoner.dto";

export class ModifySummonerInput extends PartialType(CreateSummonerInput) {
  @IsNumber()
  summonerId: number;
}

export class ModifySummonerOutput extends CoreOutput {
}