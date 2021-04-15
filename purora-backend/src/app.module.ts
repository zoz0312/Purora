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
        NODE_ENV: Joi.string().valid('dev', 'production', 'test').required(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_DATABASE: Joi.string(),
        DB_USER: Joi.string(),
        DB_PASSSWORD: Joi.string(),
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
      entities: [
        Commands,
        Keyword,
        Working,
        Rooms,
      ],
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}