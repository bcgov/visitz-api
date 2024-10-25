import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { HelpersModule } from '../../helpers/helpers.module';

describe('CasesController', () => {
  let controller: CasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), HelpersModule],
      providers: [CasesService],
      controllers: [CasesController],
    }).compile();

    controller = module.get<CasesController>(CasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
