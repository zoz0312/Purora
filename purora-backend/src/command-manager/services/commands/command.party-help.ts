import { HELP_PARTY, HELP_PARTY_DETAIL, PARTY_HELP_SERVICE } from "src/command-manager/command-manager.constants";

/*
  @author AJu (zoz0312)
  Party 관리에 관련된 명령어 목록
*/
const service = PARTY_HELP_SERVICE;
export const commandPartyHelp: commandDTO[] = [
  {
    service,
    name: HELP_PARTY,
    command: ['도', '도움', '도움말', '사용법'],
    desc: '도움말',
  },
  {
    service,
    name: HELP_PARTY_DETAIL,
    command: ['상세도움말'],
    desc: '상세도움말',
  },
];