import { Test, TestingModule } from '@nestjs/testing';
import { CaseloadService } from './caseload.service';

describe('CaseloadService', () => {
  let service: CaseloadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaseloadService],
    }).compile();

    service = module.get<CaseloadService>(CaseloadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
