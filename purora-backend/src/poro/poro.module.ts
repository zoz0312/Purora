import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { PoroController } from './poro.controller';
import { PoroService } from './poro.service';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [UserModule, JwtModule],
  controllers: [PoroController],
  providers: [PoroService]
})
export class PoroModule {}
