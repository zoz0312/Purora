import {
  ADMIN_HELP,
  ADMIN_HELP_SERVICE,
} from "../../command-manager/command-manager.constants";

const service = ADMIN_HELP_SERVICE;
export const commandAdminHelpCommand: adminCommandDTO[] = [
  {
    service,
    name: ADMIN_HELP,
    command: ['help'],
    desc: '도움말',
  },
];