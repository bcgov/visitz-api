import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TokenRefresherService } from './token-refresher.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [TokenRefresherService],
  exports: [TokenRefresherService],
})
export class TokenRefresherModule {}
