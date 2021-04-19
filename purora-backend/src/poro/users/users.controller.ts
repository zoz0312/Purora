import { Controller, Post, Get, Body } from '@nestjs/common';
import { CreateUserOutput, CreateUserInput } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { LoginInput, LoginOutput } from './dtos/login.dto';

@Controller('users')
export class UsersController {
  constructor (
    private readonly usersService: UsersService,
  ) {}

  @Post('create-user')
  async createUser(
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
}
