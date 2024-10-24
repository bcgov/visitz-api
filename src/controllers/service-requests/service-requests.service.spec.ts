import { Test, TestingModule } from '@nestjs/testing';
import { ServiceRequestsService } from './service-requests.service';

describe('ServiceRequestsService', () => {
  let service: ServiceRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceRequestsService],
    }).compile();

    service = module.get<ServiceRequestsService>(ServiceRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
