import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { PoroController } from './poro.controller';
import { PoroService } from './poro.service';

@Module({
  imports: [UserModule],
  controllers: [PoroController],
  providers: [PoroService]
})
export class PoroModule {}
