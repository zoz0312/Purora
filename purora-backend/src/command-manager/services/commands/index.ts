import { commandPartyManager } from './command.party-manager';
import { commandPartyUserManager } from './command.party-user-manager';
import { commandPartyHelp } from './command.party-help';
import { commandCustomUserCommand } from './command.custom-user-command';
import { commandWorkingListManager } from './command.working-list';
import { commandStockManager } from './command.stock';
import { commandWeatherManager } from './command.weather';

/*
  @author AJu (zoz0312)
  주요 명령어 묶는 곳
*/
export const commandList: commandDTO[] = [
  ...commandPartyManager,
  ...commandPartyUserManager,
  ...commandPartyHelp,
  ...commandCustomUserCommand,
  ...commandWorkingListManager,
  ...commandStockManager,
  ...commandWeatherManager,
];
