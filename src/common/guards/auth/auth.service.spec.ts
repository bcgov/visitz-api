import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AuthService } from './auth.service';
import { UtilitiesService } from '../../../helpers/utilities/utilities.service';
import { ConfigService } from '@nestjs/config';
import { RecordType } from '../../../common/constants/enumerations';
import { EnumTypeError } from '../../../common/errors/errors';

describe('AuthService', () => {
  let service: AuthService;

  const validId = 'id1234';
  const validRecordType = RecordType.Case;
  const validPath = `/${validRecordType}/${validId}/testendpoint`;
  const notinEnumPath = `/fjofijp/${validId}/testendpoint`;
  const incorrectFormatPath = 'abcdefg';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: CACHE_MANAGER, useValue: {} },
        UtilitiesService,
        ConfigService,
        { provide: HttpService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('grabRecordInfoFromPath function', () => {
    it('returns an array of [id, type] when the correct url format is passed', () => {
      const [id, recordType] = service.grabRecordInfoFromPath(validPath);
      expect(id).toEqual(validId);
      expect(recordType).toEqual(validRecordType);
    });

    it(`throws an error when the enum doesn't match the record type`, () => {
      expect(() => {
        service.grabRecordInfoFromPath(notinEnumPath);
      }).toThrow(EnumTypeError);
    });

    it(`throws an error when the url doesn't match the correct format`, () => {
      expect(() => {
        service.grabRecordInfoFromPath(incorrectFormatPath);
      }).toThrow(Error);
    });
  });
});
