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
import {
  EntityType,
  SafetyAssessmentDecisionUnsafe,
  YesNoEnum,
  YNEnum,
} from '../../common/constants/enumerations';
import {
  SubmitSafetyAssessmentResponseExample,
  SubmitSafetyAssessmentWorkflowEntity,
} from '../../entities/submit-safety-assessment.entity';
import { SafetyAssessmentWorkflowDto } from '../../dto/workflow-submit-safety-assessment.dto';

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

  describe('submitSafetyAssessmentWorkflow tests', () => {
    it.each([
      [
        SubmitSafetyAssessmentResponseExample,
        new SafetyAssessmentWorkflowDto({
          Payload: [
            {
              incidentNumber: '123456',
              dateOfAssessment: '08/20/2025',
              familyName: 'Test',
            },
          ],
          factorInfluence: [
            {
              ageUptoFive: YNEnum.False,
              medicalMentalDisorder: YNEnum.False,
              notReadilyAccessible: YNEnum.False,
              diminishedMental: YNEnum.False,
              diminishedPhysical: YNEnum.False,
            },
          ],
          safetyFactors: [
            {
              physicalHarm: YesNoEnum.False,
              seriousInjuryAbuse: YNEnum.False,
              fearsMaltreatChild: YNEnum.False,
              threatAgainstChild: YNEnum.False,
              excessiveForce: YNEnum.False,
              subsExposedInfant: YNEnum.False,
              cmtClarification: 'test',
              currentCircumstances: YesNoEnum.True,
              cmtCircumstances: 'test',
              sexAbuse: YesNoEnum.False,
              cmtAbuse: 'test',
              unableToProtect: YesNoEnum.False,
              cmtProtect: 'test',
              injuryExplanation: YesNoEnum.False,
              cmtExplanation: 'test',
              refuseAccess: YesNoEnum.False,
              cmtAccess: 'test',
              immediateNeeds: YesNoEnum.False,
              cmtNeeds: 'test',
              physicalCondition: YesNoEnum.False,
              cmtCondition: 'test',
              currentAbuse: YesNoEnum.False,
              cmtCurrent: 'test',
              partnerViolence: YesNoEnum.False,
              cmtViolence: 'test',
              predominantlyNegative: YesNoEnum.False,
              cmtNegative: 'test',
              emotionalStability: YesNoEnum.False,
              cmtEmotional: 'test',
              childFearful: YesNoEnum.False,
              cmtFearful: 'test',
              otherFactors: YesNoEnum.False,
              cmtOtherFactors: 'test',
            },
          ],
          protectiveCapacity: [
            {
              childCognitive: YNEnum.False,
              parentCognitive: YNEnum.False,
              parentWillingness: YNEnum.False,
              parentResources: YNEnum.False,
              parentSupportive: YNEnum.False,
              parentProtect: YNEnum.False,
              parentAccept: YNEnum.False,
              parentRelationship: YNEnum.False,
              parentAware: YNEnum.False,
              parentProbSolving: YNEnum.False,
              noProCapPresent: YNEnum.False,
              capacitiesOther: YNEnum.False,
              cmtProtectiveCapacity01: 'test',
              cmtProtectiveCapacity02: 'test',
            },
          ],
          safetyInterventions: [
            {
              directIntervention: YNEnum.False,
              useOfIndividuals: YNEnum.False,
              useCommAgencies: YNEnum.False,
              protectVictim: YNEnum.False,
              leaveHome: YNEnum.False,
              nonOffendingParent: YNEnum.False,
              legalIntPlanned: YNEnum.False,
              otherSafetyInterventions: YNEnum.False,
              childOutsideHome: YNEnum.False,
              childRemoved: YNEnum.False,
            },
          ],
          safetyDecisions: [
            {
              noSafetyFactors: YNEnum.False,
              safeInterventions: YNEnum.False,
              unsafeSafetyFactors: YNEnum.True,
              decisionUnsafe: SafetyAssessmentDecisionUnsafe.Some,
              comments: 'test',
              narrative: 'test',
              readyFinalize: YNEnum.False,
              readyFinalizeDate: '08/11/2025',
              approvedFinalize: YNEnum.False,
              approvedFinalizeDate: '08/11/2025',
            },
          ],
          childsInOutCare: [
            {
              childContactId: '123456',
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

      const result = await service.submitSafetyAssessmentWorkflow(body, 'idir');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(new SubmitSafetyAssessmentWorkflowEntity(data));
    });
  });
});
