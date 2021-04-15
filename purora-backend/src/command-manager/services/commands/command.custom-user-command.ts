import { CREATE_USER_COMMNAD, CUSTOM_USER_COMMAND_SERVICE, DELETE_USER_COMMAND, READ_USER_COMMAND, SHOW_USER_COMMAND_LIST } from "src/command-manager/command-manager.constants";

/*
  @author AJu (zoz0312)
  User Command 추가를 위한 명령어 목록
*/
const service = CUSTOM_USER_COMMAND_SERVICE;
export const commandCustomUserCommand: commandDTO[] = [
  {
    service,
    name: READ_USER_COMMAND,
    command: ['allCommandRead'],
    desc: '등록된 전체 키워드 확인',
    hiddenFlag: true,
  },
  {
    service,
    name: CREATE_USER_COMMNAD,
    command: ['학습하기', '가르치기',],
    desc: '오로라 학습하기',
    argumentDesc: ['(학습키워드)::(내용) 또는 (학습키워드)::(내용1)|(내용2)|(내용3)...'],
  },
  {
    service,
    name: SHOW_USER_COMMAND_LIST,
    command: ['학습내역', '가르치기내역'],
    desc: '오로라 학습 내역보기',
    argumentDesc: ['학습키워드'],
  },
  {
    service,
    name: DELETE_USER_COMMAND,
    command: ['학습제거', '학습삭제'],
    desc: '오로라 학습 제거',
    argumentDesc: ['[일부삭제](학습키워드)::(ID) 또는 [전체삭제](학습키워드)::all'],
  },
];