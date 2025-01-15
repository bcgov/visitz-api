import { Test, TestingModule } from '@nestjs/testing';
import { CaseloadController } from './caseload.controller';
import { CaseloadService } from './caseload.service';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import configuration from '../../configuration/configuration';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';

describe('CaseloadController', () => {
  let controller: CaseloadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaseloadController],
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        CaseloadService,
        TokenRefresherService,
        RequestPreparerService,
        { provide: CACHE_MANAGER, useValue: {} },
        ConfigService,
        UtilitiesService,
        { provide: HttpService, useValue: { get: jest.fn(), post: jest.fn() } },
      ],
    }).compile();

    controller = module.get<CaseloadController>(CaseloadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
