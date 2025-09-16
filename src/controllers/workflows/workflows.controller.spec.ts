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
import {
  SubmitSafetyAssessmentResponseExample,
  SubmitSafetyAssessmentWorkflowEntity,
} from '../../entities/submit-safety-assessment.entity';

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

  describe('postWorkflowNotes tests', () => {
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

  describe('postWorkflowSafetyAssessment tests', () => {
    it.each([
      [
        {
          Payload: [
            {
              incidentNumber: '123456',
              dateOfAssessment: '08/20/2025',
              familyName: 'Test',
            },
          ],
          factorInfluence: [
            {
              ageUptoFive: 'N',
              medicalMentalDisorder: 'N',
              notReadilyAccessible: 'N',
              diminishedMental: 'N',
              diminishedPhysical: 'N',
            },
          ],
          safetyFactors: [
            {
              physicalHarm: 'No',
              seriousInjuryAbuse: 'N',
              fearsMaltreatChild: 'N',
              threatAgainstChild: 'N',
              excessiveForce: 'N',
              subsExposedInfant: 'N',
              cmtClarification: 'test',
              currentCircumstances: 'Yes',
              cmtCircumstances: 'test',
              sexAbuse: 'No',
              cmtAbuse: 'test',
              unableToProtect: 'No',
              cmtProtect: 'test',
              injuryExplanation: 'No',
              cmtExplanation: 'test',
              refuseAccess: 'No',
              cmtAccess: 'test',
              immediateNeeds: 'No',
              cmtNeeds: 'test',
              physicalCondition: 'No',
              cmtCondition: 'test',
              currentAbuse: 'No',
              cmtCurrent: 'test',
              partnerViolence: 'No',
              cmtViolence: 'test',
              predominantlyNegative: 'No',
              cmtNegative: 'test',
              emotionalStability: 'No',
              cmtEmotional: 'test',
              childFearful: 'No',
              cmtFearful: 'test',
              otherFactors: 'No',
              cmtOtherFactors: 'test',
            },
          ],
          protectiveCapacity: [
            {
              childCognitive: 'N',
              parentCognitive: 'N',
              parentWillingness: 'N',
              parentResources: 'N',
              parentSupportive: 'N',
              parentProtect: 'N',
              parentAccept: 'N',
              parentRelationship: 'N',
              parentAware: 'N',
              parentProbSolving: 'N',
              noProCapPresent: 'N',
              capacitiesOther: 'N',
              cmtProtectiveCapacity01: 'test',
              cmtProtectiveCapacity02: 'test',
            },
          ],
          safetyInterventions: [
            {
              directIntervention: 'N',
              useOfIndividuals: 'N',
              useCommAgencies: 'N',
              protectVictim: 'N',
              leaveHome: 'N',
              nonOffendingParent: 'N',
              legalIntPlanned: 'N',
              otherSafetyInterventions: 'N',
              childOutsideHome: 'N',
              childRemoved: 'N',
            },
          ],
          safetyDecisions: [
            {
              noSafetyFactors: 'N',
              safeInterventions: 'N',
              unsafeSafetyFactors: 'Y',
              decisionUnsafe: 'Some children placed',
              comments: 'test',
              narrative: 'test',
              readyFinalize: 'N',
              readyFinalizeDate: '08/11/2025',
              approvedFinalize: 'N',
              approvedFinalizeDate: '08/11/2025',
            },
          ],
          childsInOutCare: [
            {
              childContactId: '123456',
            },
          ],
        },
        'idir',
        SubmitSafetyAssessmentResponseExample,
      ],
    ])(
      'should return a single nested given good input',
      async (body, idir, data) => {
        const workflowServiceSpy = jest
          .spyOn(workflowsService, 'submitSafetyAssessmentWorkflow')
          .mockReturnValueOnce(
            Promise.resolve(new SubmitSafetyAssessmentWorkflowEntity(data)),
          );

        const result = await controller.postWorkflowSafetyAssessment(req, body);
        expect(workflowServiceSpy).toHaveBeenCalledWith(body, idir);
        expect(result).toEqual(new SubmitSafetyAssessmentWorkflowEntity(data));
      },
    );
  });
});
