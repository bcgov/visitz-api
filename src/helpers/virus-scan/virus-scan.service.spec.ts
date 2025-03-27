import { Test, TestingModule } from '@nestjs/testing';
import { VirusScanService } from './virus-scan.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../configuration/configuration';

describe('VirusScanService', () => {
  let service: VirusScanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [VirusScanService, ConfigService],
    }).compile();

    service = module.get<VirusScanService>(VirusScanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
