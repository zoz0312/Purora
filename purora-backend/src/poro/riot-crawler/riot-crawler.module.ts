import {DynamicModule, Global, Module} from '@nestjs/common';
import { RiotCrawlerService } from './riot-crawler.service';
import {PorotModuleOptions} from "../poro.module";
import {CONFIG_OPTIONS, PORO_CONFIG_OPTIONS} from "../../common/constants";

@Global()
@Module({})
export class RiotCrawlerModule {
  static forRoot(options: PorotModuleOptions): DynamicModule {
    return {
      module: RiotCrawlerModule,
      providers: [
        {
          provide: PORO_CONFIG_OPTIONS,
          useValue: options,
        },
        RiotCrawlerService
      ],
      exports: [RiotCrawlerService],
    }
  }
}
