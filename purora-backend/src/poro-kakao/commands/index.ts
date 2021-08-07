import {commandAdminCommand} from "./commnad.kakao-user-info";
import {commandAdminRoomCommand} from "./commnad.kakao-room";
import {commandAdminHelpCommand} from "./commnad.admin-help";

export const adminCommandList: adminCommandDTO[] = [
  ...commandAdminCommand,
  ...commandAdminRoomCommand,
  ...commandAdminHelpCommand,
];