import { Test, TestingModule } from '@nestjs/testing';
import { CaseloadService } from './caseload.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../configuration/configuration';
import { JwtService } from '@nestjs/jwt';

describe('CaseloadService', () => {
  let service: CaseloadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        CaseloadService,
        UtilitiesService,
        JwtService,
        TokenRefresherService,
        RequestPreparerService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: () => jest.fn(),
            get: () => 'Bearer token',
          },
        },
      ],
    }).compile();

    service = module.get<CaseloadService>(CaseloadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
