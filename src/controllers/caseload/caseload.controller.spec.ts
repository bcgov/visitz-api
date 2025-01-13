import { Test, TestingModule } from '@nestjs/testing';
import { CaseloadController } from './caseload.controller';

describe('CaseloadController', () => {
  let controller: CaseloadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaseloadController],
    }).compile();

    controller = module.get<CaseloadController>(CaseloadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
