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
import { JwtService } from '@nestjs/jwt';
import {
  CaseloadCompleteResponseExample,
  CaseloadEntity,
} from '../../entities/caseload.entity';
import {
  CaseloadQueryParams,
  EntityQueryParams,
} from '../../dto/filter-query-params.dto';
import { plainToInstance } from 'class-transformer';
import { getMockReq, getMockRes } from '@jest-mock/express';
import {
  afterParamName,
  idName,
  officeNamesSeparator,
} from '../../common/constants/parameter-constants';
import { idirUsernameHeaderField } from '../../common/constants/upstream-constants';
import { AuthService } from '../../common/guards/auth/auth.service';
import { ExternalAuthService } from '../external-auth/external-auth.service';
import { EntityScope, RecordType } from '../../common/constants/enumerations';
import {
  NestedSREntity,
  SRListResponseExample,
} from '../../entities/sr.entity';
import {
  NestedCaseEntity,
  CaseListResponseExample,
} from '../../entities/case.entity';
import {
  NestedIncidentEntity,
  IncidentListResponseExample,
} from '../../entities/incident.entity';
import {
  NestedMemoEntity,
  MemoListResponseExample,
} from '../../entities/memo.entity';
import { IdPathParams } from '../../dto/id-path-params.dto';

describe('CaseloadController', () => {
  let controller: CaseloadController;
  let caseloadService: CaseloadService;
  let externalAuthService: ExternalAuthService;
  const { res, mockClear } = getMockRes();
  const req = getMockReq({ headers: { [idirUsernameHeaderField]: 'idir' } });
  const officeNames = `office1${officeNamesSeparator}office2`;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaseloadController],
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        CaseloadService,
        TokenRefresherService,
        RequestPreparerService,
        AuthService,
        ExternalAuthService,
        { provide: CACHE_MANAGER, useValue: {} },
        ConfigService,
        UtilitiesService,
        JwtService,
        { provide: HttpService, useValue: { get: jest.fn(), post: jest.fn() } },
      ],
    }).compile();

    controller = module.get<CaseloadController>(CaseloadController);
    caseloadService = module.get<CaseloadService>(CaseloadService);
    externalAuthService = module.get<ExternalAuthService>(ExternalAuthService);
    mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCaseload tests', () => {
    it.each([
      [
        CaseloadCompleteResponseExample,
        {
          [afterParamName]: '1900-01-01',
        } as CaseloadQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, filterQueryParams) => {
        const externalAuthServiceSpy = jest
          .spyOn(externalAuthService, 'checkEmployeeStatusUpstream')
          .mockImplementationOnce(() => {
            return Promise.resolve(officeNames);
          });
        const caseloadServiceSpy = jest
          .spyOn(caseloadService, 'getCaseload')
          .mockReturnValueOnce(
            Promise.resolve(
              plainToInstance(CaseloadEntity, data, {
                enableImplicitConversion: true,
              }),
            ),
          );

        const result = await controller.getCaseload(
          req,
          res,
          filterQueryParams,
        );
        expect(externalAuthServiceSpy).toHaveBeenCalledTimes(1);
        expect(caseloadServiceSpy).toHaveBeenCalledWith(
          'idir',
          req,
          res,
          filterQueryParams,
        );
        expect(result).toEqual(
          plainToInstance(CaseloadEntity, data, {
            enableImplicitConversion: true,
          }),
        );
      },
    );
  });

  describe('getOfficeCaseload tests', () => {
    it.each([
      [
        CaseloadCompleteResponseExample,
        {
          [afterParamName]: '1900-01-01',
        } as CaseloadQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, filterQueryParams) => {
        const externalAuthServiceSpy = jest
          .spyOn(externalAuthService, 'checkEmployeeStatusUpstream')
          .mockImplementationOnce(() => {
            return Promise.resolve(officeNames);
          });
        const caseloadServiceSpy = jest
          .spyOn(caseloadService, 'getOfficeCaseload')
          .mockReturnValueOnce(
            Promise.resolve(
              plainToInstance(CaseloadEntity, data, {
                enableImplicitConversion: true,
              }),
            ),
          );

        const result = await controller.getOfficeCaseload(
          req,
          res,
          filterQueryParams,
        );
        expect(externalAuthServiceSpy).toHaveBeenCalledTimes(1);
        expect(caseloadServiceSpy).toHaveBeenCalledWith(
          'idir',
          req,
          res,
          officeNames,
          filterQueryParams,
        );
        expect(result).toEqual(
          plainToInstance(CaseloadEntity, data, {
            enableImplicitConversion: true,
          }),
        );
      },
    );
  });

  describe('getSrs tests', () => {
    it.each([
      [undefined, undefined],
      [{ group: EntityScope.Office } as EntityQueryParams, officeNames],
    ])(
      'should call getSingleEntityType with correct officeNames',
      async (filterQueryParams, expectedOfficeNames) => {
        const externalAuthServiceSpy = jest
          .spyOn(externalAuthService, 'checkEmployeeStatusUpstream')
          .mockImplementationOnce(() => {
            return Promise.resolve(officeNames);
          });
        const expectedResult = plainToInstance(
          NestedSREntity,
          SRListResponseExample,
          { enableImplicitConversion: true },
        );
        const caseloadServiceSpy = jest
          .spyOn(caseloadService, 'getSingleEntityType')
          .mockReturnValueOnce(Promise.resolve(expectedResult));

        const result = await controller.getSrs(req, res, filterQueryParams);
        expect(externalAuthServiceSpy).toHaveBeenCalledTimes(1);
        expect(caseloadServiceSpy).toHaveBeenCalledWith(
          'idir',
          req,
          res,
          RecordType.SR,
          expectedOfficeNames,
          filterQueryParams,
        );
        expect(result).toEqual(expectedResult);
      },
    );
  });

  describe('getSrById tests', () => {
    it('should call getEntityById with the parsed id and officeNames', async () => {
      const idParam = { [idName]: 'entity-id-here' } as IdPathParams;
      const externalAuthServiceSpy = jest
        .spyOn(externalAuthService, 'checkEmployeeStatusUpstream')
        .mockImplementationOnce(() => {
          return Promise.resolve(officeNames);
        });
      const expectedResult = plainToInstance(
        NestedSREntity,
        SRListResponseExample,
        { enableImplicitConversion: true },
      );
      const caseloadServiceSpy = jest
        .spyOn(caseloadService, 'getEntityById')
        .mockReturnValueOnce(Promise.resolve(expectedResult));

      const result = await controller.getSrById(req, res, idParam);
      expect(externalAuthServiceSpy).toHaveBeenCalledTimes(1);
      expect(caseloadServiceSpy).toHaveBeenCalledWith(
        'idir',
        idParam[idName],
        req,
        res,
        RecordType.SR,
        officeNames,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getCases tests', () => {
    it.each([
      [undefined, undefined],
      [{ group: EntityScope.Office } as EntityQueryParams, officeNames],
    ])(
      'should call getSingleEntityType with correct officeNames',
      async (filterQueryParams, expectedOfficeNames) => {
        const externalAuthServiceSpy = jest
          .spyOn(externalAuthService, 'checkEmployeeStatusUpstream')
          .mockImplementationOnce(() => {
            return Promise.resolve(officeNames);
          });
        const expectedResult = plainToInstance(
          NestedCaseEntity,
          CaseListResponseExample,
          { enableImplicitConversion: true },
        );
        const caseloadServiceSpy = jest
          .spyOn(caseloadService, 'getSingleEntityType')
          .mockReturnValueOnce(Promise.resolve(expectedResult));

        const result = await controller.getCases(req, res, filterQueryParams);
        expect(externalAuthServiceSpy).toHaveBeenCalledTimes(1);
        expect(caseloadServiceSpy).toHaveBeenCalledWith(
          'idir',
          req,
          res,
          RecordType.Case,
          expectedOfficeNames,
          filterQueryParams,
        );
        expect(result).toEqual(expectedResult);
      },
    );
  });

  describe('getCaseById tests', () => {
    it('should call getEntityById with the parsed id and officeNames', async () => {
      const idParam = { [idName]: 'entity-id-here' } as IdPathParams;
      const externalAuthServiceSpy = jest
        .spyOn(externalAuthService, 'checkEmployeeStatusUpstream')
        .mockImplementationOnce(() => {
          return Promise.resolve(officeNames);
        });
      const expectedResult = plainToInstance(
        NestedCaseEntity,
        CaseListResponseExample,
        { enableImplicitConversion: true },
      );
      const caseloadServiceSpy = jest
        .spyOn(caseloadService, 'getEntityById')
        .mockReturnValueOnce(Promise.resolve(expectedResult));

      const result = await controller.getCaseById(req, res, idParam);
      expect(externalAuthServiceSpy).toHaveBeenCalledTimes(1);
      expect(caseloadServiceSpy).toHaveBeenCalledWith(
        'idir',
        idParam[idName],
        req,
        res,
        RecordType.Case,
        officeNames,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getIncidents tests', () => {
    it.each([
      [undefined, undefined],
      [{ group: EntityScope.Office } as EntityQueryParams, officeNames],
    ])(
      'should call getSingleEntityType with correct officeNames',
      async (filterQueryParams, expectedOfficeNames) => {
        const externalAuthServiceSpy = jest
          .spyOn(externalAuthService, 'checkEmployeeStatusUpstream')
          .mockImplementationOnce(() => {
            return Promise.resolve(officeNames);
          });
        const expectedResult = plainToInstance(
          NestedIncidentEntity,
          IncidentListResponseExample,
          { enableImplicitConversion: true },
        );
        const caseloadServiceSpy = jest
          .spyOn(caseloadService, 'getSingleEntityType')
          .mockReturnValueOnce(Promise.resolve(expectedResult));

        const result = await controller.getIncidents(
          req,
          res,
          filterQueryParams,
        );
        expect(externalAuthServiceSpy).toHaveBeenCalledTimes(1);
        expect(caseloadServiceSpy).toHaveBeenCalledWith(
          'idir',
          req,
          res,
          RecordType.Incident,
          expectedOfficeNames,
          filterQueryParams,
        );
        expect(result).toEqual(expectedResult);
      },
    );
  });

  describe('getIncidentById tests', () => {
    it('should call getEntityById with the parsed id and officeNames', async () => {
      const idParam = { [idName]: 'entity-id-here' } as IdPathParams;
      const externalAuthServiceSpy = jest
        .spyOn(externalAuthService, 'checkEmployeeStatusUpstream')
        .mockImplementationOnce(() => {
          return Promise.resolve(officeNames);
        });
      const expectedResult = plainToInstance(
        NestedIncidentEntity,
        IncidentListResponseExample,
        { enableImplicitConversion: true },
      );
      const caseloadServiceSpy = jest
        .spyOn(caseloadService, 'getEntityById')
        .mockReturnValueOnce(Promise.resolve(expectedResult));

      const result = await controller.getIncidentById(req, res, idParam);
      expect(externalAuthServiceSpy).toHaveBeenCalledTimes(1);
      expect(caseloadServiceSpy).toHaveBeenCalledWith(
        'idir',
        idParam[idName],
        req,
        res,
        RecordType.Incident,
        officeNames,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getMemos tests', () => {
    it.each([
      [undefined, undefined],
      [{ group: EntityScope.Office } as EntityQueryParams, officeNames],
    ])(
      'should call getSingleEntityType with correct officeNames',
      async (filterQueryParams, expectedOfficeNames) => {
        const externalAuthServiceSpy = jest
          .spyOn(externalAuthService, 'checkEmployeeStatusUpstream')
          .mockImplementationOnce(() => {
            return Promise.resolve(officeNames);
          });
        const expectedResult = plainToInstance(
          NestedMemoEntity,
          MemoListResponseExample,
          { enableImplicitConversion: true },
        );
        const caseloadServiceSpy = jest
          .spyOn(caseloadService, 'getSingleEntityType')
          .mockReturnValueOnce(Promise.resolve(expectedResult));

        const result = await controller.getMemos(req, res, filterQueryParams);
        expect(externalAuthServiceSpy).toHaveBeenCalledTimes(1);
        expect(caseloadServiceSpy).toHaveBeenCalledWith(
          'idir',
          req,
          res,
          RecordType.Memo,
          expectedOfficeNames,
          filterQueryParams,
        );
        expect(result).toEqual(expectedResult);
      },
    );
  });

  describe('getMemoById tests', () => {
    it('should call getEntityById with the parsed id and officeNames', async () => {
      const idParam = { [idName]: 'entity-id-here' } as IdPathParams;
      const externalAuthServiceSpy = jest
        .spyOn(externalAuthService, 'checkEmployeeStatusUpstream')
        .mockImplementationOnce(() => {
          return Promise.resolve(officeNames);
        });
      const expectedResult = plainToInstance(
        NestedMemoEntity,
        MemoListResponseExample,
        { enableImplicitConversion: true },
      );
      const caseloadServiceSpy = jest
        .spyOn(caseloadService, 'getEntityById')
        .mockReturnValueOnce(Promise.resolve(expectedResult));

      const result = await controller.getMemoById(req, res, idParam);
      expect(externalAuthServiceSpy).toHaveBeenCalledTimes(1);
      expect(caseloadServiceSpy).toHaveBeenCalledWith(
        'idir',
        idParam[idName],
        req,
        res,
        RecordType.Memo,
        officeNames,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
