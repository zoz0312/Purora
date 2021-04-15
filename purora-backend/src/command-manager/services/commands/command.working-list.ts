import { CREATE_WORKING, DELETE_WORKING, UPDATE_WORKING, WORKING_LIST_MANAGER_SERVICE } from "src/command-manager/command-manager.constants";

/*
  @author AJu (zoz0312)
  룽지님 working list
*/
const service = WORKING_LIST_MANAGER_SERVICE;
export const commandWorkingListManager: commandDTO[] = [
  {
    service,
    name: CREATE_WORKING,
    command: ['작업생성'],
    desc: '작업 생성',
    argumentDesc: ['유저이름::챔피언'],
  },
  {
    service,
    name: UPDATE_WORKING,
    command: ['작업수정'],
    desc: '작업 상태 수정',
    argumentDesc: ['ID', '(상태 - 0: todo, 1: working, 2: finish)'],
  },
  {
    service,
    name: DELETE_WORKING,
    command: ['작업삭제'],
    desc: '작업 상태 삭제',
    argumentDesc: ['ID'],
  },
];