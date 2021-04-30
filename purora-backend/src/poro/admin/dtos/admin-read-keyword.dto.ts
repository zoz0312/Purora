import { CoreOutput } from "src/common/dtos/output.dto";
import { Keyword } from './../../../user-custom-command/entities/keyword.entitiy';

export class AdminReadKeywordOutput extends CoreOutput {
  data?: Keyword;
}