import { Module } from '@nestjs/common';
import { CommandManagerController } from './command-manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomUserCommand } from './services/custom-user-command.service';
import { PartyManager } from './services/party-manager.service';
import { PartyUserManager } from './services/party-user-manager.service';
import { PartyHelp } from './services/party-help.service';
import { WorkingListManager } from './services/working-list.service';
import { CommandsRepository } from '../user-custom-command/repositories/commands.repository';
import { KeywordRepository } from '../user-custom-command/repositories/keyword.repository';
import { WorkingRepository } from '../user-custom-command/repositories/working.repository';
import { RoomsRepository } from '../user-custom-command/repositories/rooms.repository';
import { CommandManagerService } from './command-manager.service';
import { StockManagerService } from './services/stock.service';
import { WeatherService } from './services/weather.service';

/*
  @author AJu (zoz0312)
*/
@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommandsRepository,
      KeywordRepository,
      WorkingRepository,
      RoomsRepository,
      // Commands,
      // Keyword,
      // Working,
    ]),
  ],
  controllers: [CommandManagerController],
  providers: [
    PartyManager,
    PartyUserManager,
    PartyHelp,
    CustomUserCommand,
    WorkingListManager,
    CommandManagerService,
    StockManagerService,
    WeatherService,
  ],
  exports: [CommandManagerService],
})
export class CommandManagerModule {}
