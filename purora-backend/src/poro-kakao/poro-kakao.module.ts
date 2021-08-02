import {DynamicModule, Module} from '@nestjs/common';
import { PoroKakaoService } from './poro-kakao.service';
import {PORO_KAKAO_CONFIG_OPTIONS} from "../common/constants";
import {CommandManagerModule} from "../command-manager/command-manager.module";
import {UserCustomCommandModule} from "../user-custom-command/user-custom-command.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AllowRoom} from "./entities/allow-room.entity";
import {AdminCommandService} from "./services/admin-command.service";
import {AllowAdmin} from "./entities/allow-admin.entity";
import {KakaoUserService} from "./services/kakao-user.service";

export interface PoroKakaoModuleOptions {
  desktopName: string;
  deviceUUID: string;
  kakaoID: string;
  kakaoPW: string;
}

@Module({})
export class PoroKakaoModule {
  static forRoot(options: PoroKakaoModuleOptions): DynamicModule {
    return {
      module: PoroKakaoModule,
      imports: [
        CommandManagerModule,
        UserCustomCommandModule,
        TypeOrmModule.forFeature([
          AllowRoom,
          AllowAdmin,
        ]),
      ],
      providers: [
        {
          provide: PORO_KAKAO_CONFIG_OPTIONS,
          useValue: options,
        },
        PoroKakaoService,
        AdminCommandService,
        KakaoUserService,
      ],
      exports: [PoroKakaoService]
    }
  }
}
