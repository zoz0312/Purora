import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PoroController } from './poro.controller';
import { PoroService } from './poro.service';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { RiotCrawlerModule } from './riot-crawler/riot-crawler.module';

@Module({
  imports: [
    UsersModule,
    JwtModule,
    AuthModule,
    RiotCrawlerModule,
  ],
  controllers: [PoroController],
  providers: [PoroService],
})
export class PoroModule {}
