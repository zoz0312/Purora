import {
  ADMIN_KAKAO_ROOM_SERVICE,
  ADMIN_KAKAO_USER_SERVICE, KAKAO_ADD_ROOM,
  KAKAO_ADD_USER_ID, KAKAO_ALL_MENTION, KAKAO_DELETE_ROOM, KAKAO_DELETE_USER_ID, KAKAO_GET_CHANNEL_ID,
  KAKAO_USER_GET_ID
} from "../../command-manager/command-manager.constants";

const service = ADMIN_KAKAO_ROOM_SERVICE;
export const commandAdminRoomCommand: adminCommandDTO[] = [
  {
    service,
    name: KAKAO_GET_CHANNEL_ID,
    command: ['getRoomId'],
    desc: '방 ID 가져오기',
  },
  {
    service,
    name: KAKAO_ADD_ROOM,
    command: ['addRoom'],
    desc: '방 등록하기',
  },
  {
    service,
    name: KAKAO_DELETE_ROOM,
    command: ['deleteRoom'],
    desc: '방 삭제하기',
  },
];