import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../utilities/utilities.service';

@Module({
  imports: [HttpModule],
  providers: [
    ContactsService,
    ConfigService,
    RequestPreparerService,
    UtilitiesService,
    TokenRefresherService,
  ],
  exports: [ContactsService],
})
export class ContactsModule {}
