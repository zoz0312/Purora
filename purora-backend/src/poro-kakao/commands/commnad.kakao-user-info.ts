import {
  ADMIN_KAKAO_USER_SERVICE,
  KAKAO_ADD_USER_ID, KAKAO_ALL_MENTION, KAKAO_DELETE_USER_ID,
  KAKAO_USER_GET_ID
} from "../../command-manager/command-manager.constants";

const service = ADMIN_KAKAO_USER_SERVICE;
export const commandAdminCommand: adminCommandDTO[] = [
  {
    service,
    name: KAKAO_USER_GET_ID,
    command: ['getUserId'],
    desc: '유저 ID 가져오기',
  },
  {
    service,
    name: KAKAO_ADD_USER_ID,
    command: ['addUserId'],
    desc: '유저 ID 등록하기',
  },
  {
    service,
    name: KAKAO_DELETE_USER_ID,
    command: ['deleteUserId'],
    desc: '유저 ID 삭제하기',
  },
  {
    service,
    name: KAKAO_ALL_MENTION,
    command: ['전체멘션', 'allMention'],
    desc: '전체 유저 멘션',
  },
];