import { Test, TestingModule } from '@nestjs/testing';
import { InPersonVisitsService } from './in-person-visits.service';

describe('InPersonVisitsService', () => {
  let service: InPersonVisitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InPersonVisitsService],
    }).compile();

    service = module.get<InPersonVisitsService>(InPersonVisitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
