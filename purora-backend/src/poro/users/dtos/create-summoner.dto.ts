import { IsString, MinLength } from "class-validator";
import { CoreOutput } from "src/common/dtos/output.dto";

export class CreateSummonerInput {
  @IsString()
  summonerName: string;
}

export class CreateSummonerOutput extends CoreOutput {

}