
import { GetTokenInput, GetTokenOutput } from './../riot-crawler/dtos/get-token.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { IsNumber } from 'class-validator';

export class GetRiotTokenInput extends GetTokenInput {
  @IsNumber()
  summonerId: number;
}

export class GetRiotTokenOutput extends CoreOutput  {
}