import { Keyword } from "src/user-custom-command/entities/keyword.entitiy";
import { CoreOutput } from "src/common/dtos/output.dto";


export class AdminModifyKeywordsInput {
  keywords: Keyword[];
}

export class AdminModifyKeywordsOutput extends CoreOutput {
}