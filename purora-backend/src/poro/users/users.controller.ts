import { Controller, Post, Get, Body } from '@nestjs/common';
import { CreateUserOutput, CreateUserInput } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { Role } from '../auth/role.decorator';
import { AuthUser } from './../auth/auth-user.decorator';
import { Users } from './entities/users.entitiy';
import { CreateSummonerInput, CreateSummonerOutput } from './dtos/create-summoner.dto';

@Controller('users')
export class UsersController {
  constructor (
    private readonly usersService: UsersService,
  ) {}

  // @Role(['USER'])
  @Post('create-user')
  async createUser(
    // @AuthUser() user: Users,
    @Body() createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.usersService.createUser(createUserInput);
  }

  @Post('login')
  async login(
    @Body() loginInput: LoginInput,
  ): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Role(['ANY'])
  @Post('create-summoner')
  async createSummoner(
    @AuthUser() user: Users,
    @Body() createSummonerInput: CreateSummonerInput,
  ): Promise<CreateSummonerOutput> {
    return this.usersService.createSummoner(user, createSummonerInput);
  }
}
