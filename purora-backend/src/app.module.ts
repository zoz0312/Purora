import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandManagerModule } from './command-manager/command-manager.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserCustomCommandModule } from './user-custom-command/user-custom-command.module';

import { Keyword } from './user-custom-command/entities/keyword.entitiy';
import { Commands } from './user-custom-command/entities/commands.entitiy';
import { Working } from './user-custom-command/entities/working.entity';
import { Rooms } from './user-custom-command/entities/rooms.entitiy';
import { Users } from './poro/users/entities/users.entity';
import { UsersSummonerInfo } from './poro/users/entities/users-summoner-info.entity';
import { PoroModule } from './poro/poro.module';
import { JwtModule } from './poro/jwt/jwt.module';
import { GameInfo } from './poro/users/entities/game-info.entity';
import { UsersGameInfo } from './poro/users/entities/user-game-info.entity';

/*
  @author AJu (zoz0312)
*/
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
				PORT: Joi.string(),
        NODE_ENV: Joi.string().valid('dev', 'production', 'test').required(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_DATABASE: Joi.string(),
        DB_USER: Joi.string(),
        DB_PASSSWORD: Joi.string(),
        PRIVATE_KEY: Joi.string().required(),
      }),
    }),
    CommandManagerModule,
    UserCustomCommandModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      username: process.env.DB_USER,
      password: process.env.DB_PASSSWORD,
      synchronize: true,
      logging: process.env.NODE_ENV === 'dev',
      timezone: '+09:00',
      entities: [
        Commands,
        Keyword,
        Working,
        Rooms,
        Users,
        UsersSummonerInfo,
        GameInfo,
        UsersGameInfo,
      ],
    }),
    ScheduleModule.forRoot(),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY
    }),
    PoroModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
