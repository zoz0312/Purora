import { Controller, Post, Body, Get } from '@nestjs/common';
import { PoroService } from './poro.service';
import { GetRiotTokenInput, GetRiotTokenOutput } from './dtos/get-riot-token.dto';
import { GetMatchOutput } from './dtos/get-match.dto';

@Controller('poro')
export class PoroController {
  constructor (
    private readonly poroService: PoroService,
  ){}

  @Post('get-riot-token')
  async getRiotToken(
    @Body() getRiotTokenInput: GetRiotTokenInput
  ): Promise<GetRiotTokenOutput> {
    return this.poroService.getRiotToken(getRiotTokenInput);
  }

  @Get('get-match')
  async getMatch(
  ): Promise<GetMatchOutput> {
    return this.poroService.getMatch();
  }
}
