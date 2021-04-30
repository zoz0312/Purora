import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PoroService } from './poro.service';
import { GetRiotTokenInput, GetRiotTokenOutput } from './dtos/get-riot-token.dto';
import { GetMatchOutput } from './dtos/get-match.dto';
import { Role } from './auth/role.decorator';
import { Users } from './users/entities/users.entity';
import { AuthUser } from './auth/auth-user.decorator';
import { InitalizeMatchDataInput, InitalizeMatchDataOutput } from './users/dtos/initalize-match.data.dto';

@Controller('poro')
export class PoroController {
  constructor (
    private readonly poroService: PoroService,
  ){}

  @Role(['ANY'])
  @Post('get-riot-token')
  async getRiotToken(
    @AuthUser() user: Users,
    @Body() getRiotTokenInput: GetRiotTokenInput
  ): Promise<GetRiotTokenOutput> {
    return this.poroService.getRiotToken(user, getRiotTokenInput);
  }

  @Role(['ANY'])
  @Get('get-match/:id')
  async getMatch(
    @AuthUser() user: Users,
    @Param('id') id: string,
  ): Promise<GetMatchOutput> {
    return this.poroService.getMatch(user, +id);
  }

  @Role(['ANY'])
  @Post('initalize-match-data')
  async initalizeMatchData(
    @AuthUser() user: Users,
    @Body() initalizeMatchDataInput: InitalizeMatchDataInput,
  ): Promise<InitalizeMatchDataOutput> {
    return this.poroService.initalizeMatchDataInput(user, initalizeMatchDataInput);
  }
}
