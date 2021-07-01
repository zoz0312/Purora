import { deepCopy } from 'deep-copy-ts';

export enum userPosition {
  '탑' = '탑',
  '미드' = '미드',
  '정글' = '정글',
  '원딜' = '원딜',
  '서폿' = '서폿',
}

export enum partyType {
  'NONE',
  'POSITION'
}

/* Party List Caching */
export const rank = () => {
  const curDate = new Date();
  return new Date(
    curDate.getFullYear(),
    curDate.getMonth(),
    curDate.getDate(),
    22,
    0,
    10
  );
}
export const teamFight = () => {
  const curDate = new Date();
  return new Date(
    curDate.getFullYear(),
    curDate.getMonth(),
    curDate.getDate(),
    22,
    0,
    10
  );
}
export const rankPosition = () => {
  const curDate = new Date();
  return new Date(
    curDate.getFullYear(),
    curDate.getMonth(),
    curDate.getDate(),
    21,
    30,
    10
  );
}

/*
  @author AJu (zoz0312)
  메모지에이션을 하는 파티들의 묶음
*/
export interface PartyUserDTO {
  name: string;
  position: userPosition;
}

export interface partyStructureDTO {
  time: Date;
  user: Array<string | PartyUserDTO>;
  type: partyType;
};

export const partyStructure: partyStructureDTO = {
  time: new Date(),
  user: [],
  type: partyType.NONE,
};

export const party = {
  "롤키웨이(LoLky Way)": {
    '매일자랭': {
      ...deepCopy(partyStructure),
      time: rank(),
      type: partyType.NONE,
    },
    '매일내전': {
      ...deepCopy(partyStructure),
      time: teamFight(),
      type: partyType.NONE,
    },
  },
  '숨고 (정예톡)': {
    '자랭포지션': {
      ...deepCopy(partyStructure),
      time: rankPosition(),
      type: partyType.POSITION,
    }
  }
};
