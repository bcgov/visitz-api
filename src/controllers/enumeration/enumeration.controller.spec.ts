import { Test, TestingModule } from '@nestjs/testing';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { EnumerationController } from './enumeration.controller';
import { EnumerationService } from './enumeration.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  NestedListOfValuesEntity,
  ListOfValuesListResponseExample,
} from '../../entities/list-of-values.entity';
import { typeParamName } from '../../common/constants/parameter-constants';
import { ListOfValuesQueryParams } from '../../dto/filter-query-params.dto';

describe('EnumerationController', () => {
  let controller: EnumerationController;
  let enumerationService: EnumerationService;
  let utilitiesService: UtilitiesService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnumerationController],
      providers: [
        {
          provide: EnumerationService,
          useValue: { getListOfValues: jest.fn() },
        },
        UtilitiesService,
        ConfigService,
        JwtService,
      ],
    }).compile();

    controller = module.get<EnumerationController>(EnumerationController);
    enumerationService = module.get<EnumerationService>(EnumerationService);
    utilitiesService = module.get<UtilitiesService>(UtilitiesService);
    mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getListOfValues tests', () => {
    it.each([
      [{ [typeParamName]: 'Province' } as ListOfValuesQueryParams],
      [
        {
          [typeParamName]: 'Country',
        } as ListOfValuesQueryParams,
      ],
    ])(
      'should grab the idir from the request and delegate to the service',
      async (filter) => {
        const req = getMockReq({
          headers: { authorization: 'Bearer token' },
        });
        const grabIdirSpy = jest
          .spyOn(utilitiesService, 'grabIdir')
          .mockReturnValueOnce('idir');
        const expectedResult = new NestedListOfValuesEntity(
          ListOfValuesListResponseExample,
        );
        const serviceSpy = jest
          .spyOn(enumerationService, 'getListOfValues')
          .mockResolvedValueOnce(expectedResult);

        const result = await controller.getListOfValues(req, res, filter);

        expect(grabIdirSpy).toHaveBeenCalledWith(req);
        expect(serviceSpy).toHaveBeenCalledWith('idir', res, filter);
        expect(result).toEqual(expectedResult);
      },
    );
  });
});
