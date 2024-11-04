import { Test, TestingModule } from '@nestjs/testing';
import { InPersonVisitsService } from './in-person-visits.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';

describe('InPersonVisitsService', () => {
  let service: InPersonVisitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        InPersonVisitsService,
        UtilitiesService,
        ConfigService,
        TokenRefresherService,
        RequestPreparerService,
        { provide: HttpService, useValue: { get: jest.fn() } },
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: () => jest.fn(),
            get: () => 'Bearer token',
          },
        },
      ],
    }).compile();

    service = module.get<InPersonVisitsService>(InPersonVisitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
