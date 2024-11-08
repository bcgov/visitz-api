import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';

@Module({
  providers: [AttachmentsService],
})
export class AttachmentsModule {}
