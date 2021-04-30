import { CoreOutput } from "src/common/dtos/output.dto";
import { Keyword } from './../../../user-custom-command/entities/keyword.entitiy';

export class AdminReadKeywordsOutput extends CoreOutput {
  data?: Keyword[];
}