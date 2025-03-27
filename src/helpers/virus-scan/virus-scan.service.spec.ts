import { Test, TestingModule } from '@nestjs/testing';
import { VirusScanService } from './virus-scan.service';

describe('VirusScanService', () => {
  let service: VirusScanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VirusScanService],
    }).compile();

    service = module.get<VirusScanService>(VirusScanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
