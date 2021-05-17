import {DynamicModule, Module} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PoroController } from './poro.controller';
import { PoroService } from './poro.service';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { RiotCrawlerModule } from './riot-crawler/riot-crawler.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users/repositories/users.repository';
import { GameInfoRepotitory } from './users/repositories/game-info.repotitory';
import { UsersGameInfoRepotitory } from './users/repositories/users-game-info.repository';
import { UsersSummonerInfoRepository } from './users/repositories/users-summoner-info.repository';
import { AdminModule } from './admin/admin.module';

export interface PorotModuleOptions {
  seleniumServer: string;
}

@Module({})
export class PoroModule {
  static forRoot(options: PorotModuleOptions): DynamicModule {
    return {
      module: PoroModule,
      imports: [
        TypeOrmModule.forFeature([
          UsersRepository,
          GameInfoRepotitory,
          UsersGameInfoRepotitory,
          UsersSummonerInfoRepository,
        ]),
        UsersModule,
        JwtModule,
        AuthModule,
        RiotCrawlerModule.forRoot({
          seleniumServer: options.seleniumServer,
        }),
        AdminModule,
      ],
      controllers: [PoroController],
      providers: [PoroService],
    }
  }
}
