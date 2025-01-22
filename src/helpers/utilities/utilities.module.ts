import { Module } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [UtilitiesService, ConfigService],
  exports: [UtilitiesService],
  imports: [JwtModule.register({ global: true })],
})
export class UtilitiesModule {}
