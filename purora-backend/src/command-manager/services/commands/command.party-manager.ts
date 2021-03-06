
import { FIND_PARTY, PARTY_PRINT_JSON, CREATE_PARTY, DELETE_PARTY, PARTY_MANAGER_SERVICE, MODIFY_PARTY_TIME } from '../../command-manager.constants';
import { MODIFY_PARTY_NAME } from './../../command-manager.constants';

/*
  @author AJu (zoz0312)
  Party 관리에 관련된 명령어 목록
*/
const service = PARTY_MANAGER_SERVICE;
export const commandPartyManager: commandDTO[] = [
  {
    service,
    name: FIND_PARTY,
    command: ['파', '파티', '파티리', '파티목록', '파티리스트'],
    desc: '파티 조회',
  },
  {
    service,
    name: PARTY_PRINT_JSON,
    command: ['printJson'],
    desc: 'party print Json',
    hiddenFlag: true,
  },
  {
    service,
    name: CREATE_PARTY,
    command: ['파티생성', '파티생', '파생'],
    desc: '파티 생성',
    argumentDesc: ['파티이름', '시간 (1500, 15:00, 15시 00분)'],
  },
  {
    service,
    name: MODIFY_PARTY_NAME,
    command: ['파티이름수정', '파이수'],
    desc: '파티 이름 수정',
    argumentDesc: ['파티이름::변경할 파티이름'],
  },
  {
    service,
    name: MODIFY_PARTY_TIME,
    command: ['파티시간수정', '파시수'],
    desc: '파티 시간 수정',
    argumentDesc: ['파티이름::변경할시간 (1500, 15:00, 15시 00분)'],
  },
  {
    service,
    name: DELETE_PARTY,
    command: ['파티삭제', '파티삭', '파티제', '파티제거'],
    desc: '파티 삭제',
    argumentDesc: ['파티이름'],
  },
];