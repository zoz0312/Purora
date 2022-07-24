import { Injectable } from '@nestjs/common';
import { CustomUserCommand } from './services/custom-user-command.service';
import { PartyManager } from './services/party-manager.service';
import { PartyUserManager } from './services/party-user-manager.service';
import { PartyHelp } from './services/party-help.service';
import { WorkingListManager } from './services/working-list.service';
import { commandList } from './services/commands';
import {
  CUSTOM_USER_COMMAND_SERVICE,
  PARTY_HELP_SERVICE,
  PARTY_MANAGER_SERVICE,
  PARTY_USER_MANAGER_SERVICE,
  STOCK_SERVICE,
  WORKING_LIST_MANAGER_SERVICE,
} from './command-manager.constants';
import { ChatBotInput } from '../common/dtos/chatBot.dto';
import { StockManagerService } from './services/stock.service';
import { WEATHER_SERVICE } from 'src/command-manager/command-manager.constants';
import { WeatherService } from './services/weather.service';

@Injectable()
export class CommandManagerService {
  constructor(
    private customUserCommand: CustomUserCommand,
    private partyManager: PartyManager,
    private partyUserManager: PartyUserManager,
    private partyHelp: PartyHelp,
    private workingManager: WorkingListManager,
    private stockManager: StockManagerService,
    private WeatherService: WeatherService,
  ) {}

  async commandManage(chatBotInput: ChatBotInput) {
    const userCommand = chatBotInput.msg.slice(1);
    const command = userCommand.split(' ')[0];

    for (let i = 0; i < commandList.length; i++) {
      const { command: cmd, service, name } = commandList[i];

      if (cmd.includes(command)) {
        switch (service) {
          case PARTY_MANAGER_SERVICE:
            return this.partyManager.mainService(chatBotInput, name);
          case PARTY_USER_MANAGER_SERVICE:
            return this.partyUserManager.mainService(chatBotInput, name);
          case CUSTOM_USER_COMMAND_SERVICE:
            return this.customUserCommand.mainService(chatBotInput, name);
          case WORKING_LIST_MANAGER_SERVICE:
            return this.workingManager.mainService(chatBotInput, name);
          case PARTY_HELP_SERVICE:
            return this.partyHelp.mainService(name);
          case STOCK_SERVICE:
            return this.stockManager.mainService(chatBotInput, name);
          case WEATHER_SERVICE:
            return this.WeatherService.mainService(chatBotInput, name);
        }
      }
    }

    return {
      success: false,
      message: `존재하지 않는 명령어입니다. X_x`,
    };
  }
}
