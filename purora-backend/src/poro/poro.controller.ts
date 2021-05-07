import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { PoroService } from './poro.service';
import { GetRiotTokenInput, GetRiotTokenOutput } from './dtos/get-riot-token.dto';
import {
  ReadMatchAllOutput,
  ReadMatchInput,
  ReadMatchSummonerOutput,
  ReadMatchUsersOutput
} from './dtos/read-match.dto';
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
  @Get('read-match-all')
  async readMatchAllData(
    @AuthUser() user: Users,
    @Query() query: ReadMatchInput,
  ): Promise<ReadMatchAllOutput> {
    return this.poroService.readMatchAllData(user, query);
  }

  @Role(['ANY'])
  @Get('read-match-user')
  async readMatchUserData(
    @AuthUser() user: Users,
    @Query() query: ReadMatchInput,
  ): Promise<ReadMatchUsersOutput> {
    return this.poroService.readMatchUserData(user, query);
  }

  @Role(['ANY'])
  @Get('read-match-summoner/:summonerId')
  async readMatchSummonerData(
    @AuthUser() user: Users,
    @Param('summonerId') summonerId: number,
    @Query() query: ReadMatchInput,
  ): Promise<ReadMatchSummonerOutput> {
    return this.poroService.readMatchSummonerData(user, summonerId, query);
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
