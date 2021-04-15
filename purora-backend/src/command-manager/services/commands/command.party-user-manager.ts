import { ENTER_PARTY, EXIT_PARTY, PARTY_USER_MANAGER_SERVICE } from "src/command-manager/command-manager.constants";

/*
  @author AJu (zoz0312)
  Party User 관리에 관련된 명령어 목록
*/
const service = PARTY_USER_MANAGER_SERVICE;
export const commandPartyUserManager: commandDTO[] = [
  {
    service,
    name: ENTER_PARTY,
    command: ['파티참', '파티참여', '파참', '파티참가'],
    desc: '파티 참여',
    argumentDesc: ['파티이름'],
  },
  {
    service,
    name: EXIT_PARTY,
    command: ['파티탈', '파티탈퇴', '파탈'],
    desc: '파티 탈퇴',
    argumentDesc: ['파티이름'],
  }
];