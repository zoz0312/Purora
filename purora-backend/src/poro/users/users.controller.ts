import {Controller, Post, Get, Body, Patch, Param, HttpException, HttpStatus, Delete} from '@nestjs/common';
import { CreateUserOutput, CreateUserInput } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { Role } from '../auth/role.decorator';
import { AuthUser } from './../auth/auth-user.decorator';
import { Users } from './entities/users.entity';
import { CreateSummonerInput, CreateSummonerOutput } from './dtos/create-summoner.dto';
import { ModifyUserInput, ModifyUserOutput } from './dtos/modify-user.dto';
import { ReadAllSummonerOutput, ReadOneSummonerOutput } from './dtos/read-summoner.dto';
import {DeleteSummonerInput, DeleteSummonerOutput} from "./dtos/delete-summoner.dto";
import {ModifySummonerInput, ModifySummonerOutput} from "./dtos/modify-summoner.dto";

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

  @Role(['USER'])
  @Patch('modify-user')
  async modifyUser(
    @AuthUser() user: Users,
    @Body() modifyUserInput: ModifyUserInput,
  ): Promise<ModifyUserOutput> {
    return this.usersService.modifyUser(user, modifyUserInput);
  }

  @Post('login')
  async login(
    @Body() loginInput: LoginInput,
  ): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Role(['ANY'])
  @Get('read-all-summoner')
  async readAllSummoner(
  ): Promise<ReadAllSummonerOutput> {
    return this.usersService.readAllSummoner();
  }

  @Role(['ANY'])
  @Get('read-summoner/:id')
  async readOneSummoner(
    @AuthUser() user: Users,
    @Param() params,
  ): Promise<ReadOneSummonerOutput> {
    const id = +params.id;
    if (isNaN(id)) {
      throw new HttpException(``,
          HttpStatus.FORBIDDEN);
    }
    return this.usersService.readOneSummoner(user, id);
  }

  @Role(['ANY'])
  @Get('read-my-summoner')
  async readMySummoner(
    @AuthUser() user: Users,
  ): Promise<ReadAllSummonerOutput> {
    return this.usersService.readMySummoner(user);
  }

  @Role(['ANY'])
  @Post('create-summoner')
  async createSummoner(
    @AuthUser() user: Users,
    @Body() createSummonerInput: CreateSummonerInput,
  ): Promise<CreateSummonerOutput> {
    return this.usersService.createSummoner(user, createSummonerInput);
  }

  @Role(['ANY'])
  @Patch('modify-summoner')
  async modifySummoner(
    @AuthUser() user: Users,
    @Body() modifySummonerInput: ModifySummonerInput,
  ): Promise<ModifySummonerOutput> {
    return this.usersService.modifySummoner(user, modifySummonerInput);
  }

  @Role(['ANY'])
  @Delete('delete-summoner')
  async deleteSummoner(
    @AuthUser() user: Users,
    @Body() deleteSummonerInput: DeleteSummonerInput,
  ): Promise<DeleteSummonerOutput> {
    return this.usersService.deleteSummoner(user, deleteSummonerInput);
  }
}
