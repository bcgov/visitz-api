import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowsController } from './workflows.controller';
import { WorkflowAuthService } from '../../common/guards/workflow-auth/workflow-auth.service';
import { WorkflowsService } from './workflows.service';
import { getMockRes, getMockReq } from '@jest-mock/express';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { idirUsernameHeaderField } from '../../common/constants/upstream-constants';
import { AuthService } from '../../common/guards/auth/auth.service';
import configuration from '../../configuration/configuration';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import {
  SubmitNotesResponseExample,
  SubmitNotesWorkflowEntity,
} from '../../entities/submit-notes-workflow.entity';
import { EntityType } from '../../common/constants/enumerations';

describe('WorkflowsController', () => {
  let controller: WorkflowsController;
  let workflowsService: WorkflowsService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { res, mockClear } = getMockRes();
  const req = getMockReq({ headers: { [idirUsernameHeaderField]: 'idir' } });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ load: [configuration] }),
        JwtModule.register({ global: true }),
      ],
      providers: [
        WorkflowsService,
        WorkflowAuthService,
        AuthService,
        TokenRefresherService,
        RequestPreparerService,
        { provide: CACHE_MANAGER, useValue: {} },
        ConfigService,
        UtilitiesService,
        { provide: HttpService, useValue: { get: jest.fn() } },
      ],
      controllers: [WorkflowsController],
    }).compile();

    controller = module.get<WorkflowsController>(WorkflowsController);
    workflowsService = module.get<WorkflowsService>(WorkflowsService);
    mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('postSingleCaseInPersonVisitRecord tests', () => {
    it.each([
      [
        {
          RequestSubmitNotes: [
            {
              entityNumber: '123456',
              entityType: EntityType.Case,
              notePeriod: 'Period here',
              notes: 'Notes here',
            },
          ],
        },
        'idir',
        SubmitNotesResponseExample,
      ],
    ])(
      'should return a single nested given good input',
      async (body, idir, data) => {
        const workflowServiceSpy = jest
          .spyOn(workflowsService, 'submitNotesWorkflow')
          .mockReturnValueOnce(
            Promise.resolve(new SubmitNotesWorkflowEntity(data)),
          );

        const result = await controller.postWorkflowNotes(req, body);
        expect(workflowServiceSpy).toHaveBeenCalledWith(body, idir);
        expect(result).toEqual(new SubmitNotesWorkflowEntity(data));
      },
    );
  });
});
