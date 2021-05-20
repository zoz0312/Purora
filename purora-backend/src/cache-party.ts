import { deepCopy } from 'deep-copy-ts';

/* Party List Caching */
const curDate = new Date();
export const rank = new Date(
  curDate.getFullYear(),
  curDate.getMonth(),
  curDate.getDate(),
  22,
  0,
  10
);
export const teamFight = new Date(
  curDate.getFullYear(),
  curDate.getMonth(),
  curDate.getDate(),
  22,
  0,
  10
);

/*
  @author AJu (zoz0312)
  메모지에이션을 하는 파티들의 묶음
*/
export interface partyStructureDTO {
  time: Date;
  user: string[];
};

export const partyStructure: partyStructureDTO = {
  time: new Date(),
  user: [],
};

export const party = {
  "롤키웨이(LoLky Way)": {
    '매일자랭': {
      ...deepCopy(partyStructure),
      time: rank,
    },
    '매일내전': {
      ...deepCopy(partyStructure),
      time: teamFight,
    },
  }
};
