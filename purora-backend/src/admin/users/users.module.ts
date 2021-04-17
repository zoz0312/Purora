import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersGameInfo } from './entities/users-lol.entitiy';
import { Users } from './entities/users.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([
    UsersGameInfo,
    Users,
  ])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UserModule {}
