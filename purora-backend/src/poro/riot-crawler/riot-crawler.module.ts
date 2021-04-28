import { Global, Module } from '@nestjs/common';
import { RiotCrawlerService } from './riot-crawler.service';

@Global()
@Module({
  providers: [RiotCrawlerService],
  exports: [RiotCrawlerService],
})
export class RiotCrawlerModule {}
