import { Test, TestingModule } from '@nestjs/testing';
import { SafetyAssessmentService } from './safety-assessment.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { UtilitiesService } from '../utilities/utilities.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import configuration from '../../configuration/configuration';

describe('SafetyAssessmentService', () => {
  let service: SafetyAssessmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        SafetyAssessmentService,
        UtilitiesService,
        ConfigService,
        JwtService,
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

    service = module.get<SafetyAssessmentService>(SafetyAssessmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
