import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { JwtService } from '@nestjs/jwt';
import { EnumerationService } from './enumeration.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import configuration from '../../configuration/configuration';
import { getMockRes } from '@jest-mock/express';
import {
  CATALOG_VIEW_MODE,
  CHILD_LINKS,
  excludeEmptyFieldsParamName,
  typeParamName,
  UNIFORM_RESPONSE,
  uniformResponseParamName,
} from '../../common/constants/parameter-constants';
import {
  pageSizeMax,
  pageSizeParamName,
  recordCountNeededParamName,
  startRowNumParamName,
  trustedIdirHeaderName,
} from '../../common/constants/upstream-constants';
import { BooleanStringEnum, YNEnum } from '../../common/constants/enumerations';
import { ListOfValuesQueryParams } from '../../dto/filter-query-params.dto';
import {
  ListOfValuesListResponseExample,
  NestedListOfValuesEntity,
} from '../../entities/list-of-values.entity';

describe('EnumerationService', () => {
  let service: EnumerationService;
  let requestPreparerService: RequestPreparerService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        EnumerationService,
        UtilitiesService,
        ConfigService,
        TokenRefresherService,
        RequestPreparerService,
        JwtService,
        { provide: HttpService, useValue: { get: jest.fn() } },
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: () => jest.fn(),
            get: () => '******',
          },
        },
      ],
    }).compile();

    service = module.get<EnumerationService>(EnumerationService);
    requestPreparerService = module.get<RequestPreparerService>(
      RequestPreparerService,
    );
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListOfValues tests', () => {
    it.each([
      [
        { [typeParamName]: 'Province' } as ListOfValuesQueryParams,
        `([Active]="${YNEnum.True}" AND [Type]="Province")`,
        pageSizeMax,
      ],
      [
        {
          [typeParamName]: 'Province',
          [pageSizeParamName]: 25,
          [startRowNumParamName]: 50,
          [recordCountNeededParamName]: BooleanStringEnum.True,
          [excludeEmptyFieldsParamName]: YNEnum.True,
        } as ListOfValuesQueryParams,
        `([Active]="${YNEnum.True}" AND [Type]="Province")`,
        25,
      ],
    ])(
      'should return list of values with the expected searchspec and pagination',
      async (filter, expectedSearchSpec, expectedPageSize) => {
        const spy = jest
          .spyOn(requestPreparerService, 'sendGetRequest')
          .mockResolvedValueOnce({
            data: ListOfValuesListResponseExample,
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>);

        const result = await service.getListOfValues('idir', res, filter);

        expect(spy).toHaveBeenCalledTimes(1);
        const [, headers, , params] = spy.mock.calls[0];
        expect(headers[trustedIdirHeaderName]).toEqual('idir');
        expect(params['ViewMode']).toEqual(CATALOG_VIEW_MODE);
        expect(params['ChildLinks']).toEqual(CHILD_LINKS);
        expect(params[uniformResponseParamName]).toEqual(UNIFORM_RESPONSE);
        expect(params['searchspec']).toEqual(expectedSearchSpec);
        expect(params[pageSizeParamName]).toEqual(expectedPageSize);
        if (filter[startRowNumParamName] !== undefined) {
          expect(params[startRowNumParamName]).toEqual(
            filter[startRowNumParamName],
          );
        } else {
          expect(params[startRowNumParamName]).toBeUndefined();
        }
        if (filter[recordCountNeededParamName] === BooleanStringEnum.True) {
          expect(params[recordCountNeededParamName]).toEqual(
            BooleanStringEnum.True,
          );
        } else {
          expect(params[recordCountNeededParamName]).toBeUndefined();
        }
        if (filter[excludeEmptyFieldsParamName] === YNEnum.True) {
          expect(params[excludeEmptyFieldsParamName]).toEqual(YNEnum.True);
        } else {
          expect(params[excludeEmptyFieldsParamName]).toBeUndefined();
        }
        expect(result).toEqual(
          new NestedListOfValuesEntity(ListOfValuesListResponseExample),
        );
      },
    );
  });
});
