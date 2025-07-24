import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowsService } from './workflows.service';
import { getMockRes } from '@jest-mock/express';
import { HttpModule, HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import configuration from '../../configuration/configuration';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { AxiosResponse } from 'axios';
import {
  SubmitNotesResponseExample,
  SubmitNotesWorkflowEntity,
} from '../../entities/submit-notes-workflow.entity';
import { SubmitNotesWorkflowDto } from '../../dto/workflow-submit-notes.dto';
import { EntityType } from '../../common/constants/enumerations';

describe('WorkflowsService', () => {
  let service: WorkflowsService;
  let requestPreparerService: RequestPreparerService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        WorkflowsService,
        UtilitiesService,
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

    service = module.get<WorkflowsService>(WorkflowsService);
    requestPreparerService = module.get<RequestPreparerService>(
      RequestPreparerService,
    );
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('submitNotesWorkflow tests', () => {
    it.each([
      [
        SubmitNotesResponseExample,
        new SubmitNotesWorkflowDto({
          RequestSubmitNotes: [
            {
              entityNumber: '123456',
              entityType: EntityType.Case,
              notePeriod: 'Period here',
              notes: 'Notes here',
            },
          ],
        }),
      ],
    ])('should return post values given good input', async (data, body) => {
      const spy = jest
        .spyOn(requestPreparerService, 'sendPostRequest')
        .mockResolvedValueOnce({
          data: data,
          headers: {},
          status: 200,
          statusText: 'OK',
        } as AxiosResponse<any, any>);

      const result = await service.submitNotesWorkflow(body, 'idir');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(new SubmitNotesWorkflowEntity(data));
    });
  });
});
