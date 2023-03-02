import { DynamicModule, Module } from '@nestjs/common';
import { PoroKakaoService } from './poro-kakao.service';
import { PORO_KAKAO_CONFIG_OPTIONS } from '../common/constants';
import { CommandManagerModule } from '../command-manager/command-manager.module';
import { UserCustomCommandModule } from '../user-custom-command/user-custom-command.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCommandService } from './services/admin-command.service';
import { AllowAdmin } from './entities/allow-admin.entity';
import { KakaoUserService } from './services/kakao-user.service';
import { KakaoRoomService } from './services/kakao-room.service';
import { AdminHelpService } from './services/admin-help.service';
import { PoroKakaoController } from './poro-kakao.controller';
import { RoomsRepository } from '../user-custom-command/repositories/rooms.repository';

export interface PoroKakaoModuleOptions {
  desktopName: string;
  deviceUUID: string;
  kakaoID: string;
  kakaoPW: string;
}

@Module({
  controllers: [PoroKakaoController],
})
export class PoroKakaoModule {
  static forRoot(options: PoroKakaoModuleOptions): DynamicModule {
    return {
      module: PoroKakaoModule,
      imports: [
        CommandManagerModule,
        UserCustomCommandModule,
        TypeOrmModule.forFeature([AllowAdmin, RoomsRepository]),
      ],
      providers: [
        {
          provide: PORO_KAKAO_CONFIG_OPTIONS,
          useValue: options,
        },
        PoroKakaoService,
        AdminCommandService,
        KakaoUserService,
        KakaoRoomService,
        AdminHelpService,
      ],
      exports: [PoroKakaoService],
    };
  }
}
