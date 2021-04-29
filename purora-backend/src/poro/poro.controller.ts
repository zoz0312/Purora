import { Controller, Post, Body, Get } from '@nestjs/common';
import { PoroService } from './poro.service';
import { GetRiotTokenInput, GetRiotTokenOutput } from './dtos/get-riot-token.dto';
import { GetMatchOutput } from './dtos/get-match.dto';
import { Role } from './auth/role.decorator';
import { Users } from './users/entities/users.entitiy';
import { AuthUser } from './auth/auth-user.decorator';

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

  @Get('get-match')
  async getMatch(
  ): Promise<GetMatchOutput> {
    return this.poroService.getMatch();
  }
}
