
import { keywordLottoDraw } from './keyword.lotto-draw';
import { keywordWorkingList } from './keyword.working-list';
/*
  @author AJu (zoz0312)
  주요 명령어 묶는 곳
*/
export const keywordList: keywordDTO[] = [
  ...keywordWorkingList,
  ...keywordLottoDraw,
];