import { Test, TestingModule } from '@nestjs/testing';
import { SupportNetworkService } from './support-network.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

describe('SupportNetworkService', () => {
  let service: SupportNetworkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot()],
      providers: [SupportNetworkService],
    }).compile();

    service = module.get<SupportNetworkService>(SupportNetworkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
