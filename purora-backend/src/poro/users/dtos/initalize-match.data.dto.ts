import { IsNumber } from "class-validator";
import { CoreOutput } from './../../../common/dtos/output.dto';

export class InitalizeMatchDataInput {
  @IsNumber()
  beginIndex: number;

  @IsNumber()
  endIndex: number;

  @IsNumber()
  summonerIndex: number;
}

export class InitalizeMatchDataOutput extends CoreOutput {

}