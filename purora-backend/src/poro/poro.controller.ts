import { Controller, Post, Body } from '@nestjs/common';
import { PoroService } from './poro.service';
import { GetRiotTokenInput, GetRiotTokenOutput } from './../dtos/get-riot-token.dto';

@Controller('poro')
export class PoroController {
  constructor (
    private readonly poroService: PoroService,
  ){}

  @Post()
  async getRiotToken(
    @Body() getRiotTokenInput: GetRiotTokenInput
  ): Promise<GetRiotTokenOutput> {
    return this.poroService.getRiotToken(getRiotTokenInput);
  }
}
