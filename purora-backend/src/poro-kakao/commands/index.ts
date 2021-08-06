import {commandAdminCommand} from "./commnad.kakao-user-info";
import {commandAdminRoomCommand} from "./commnad.kakao-room";

export const adminCommandList: adminCommandDTO[] = [
  ...commandAdminCommand,
  ...commandAdminRoomCommand,
];