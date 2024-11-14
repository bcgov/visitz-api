import { Module } from '@nestjs/common';
import { MemosService } from './memos.service';
import { MemosController } from './memos.controller';

@Module({
  providers: [MemosService],
  controllers: [MemosController],
})
export class MemosModule {}
