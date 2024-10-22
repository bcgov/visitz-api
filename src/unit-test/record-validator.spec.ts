import { INestApplication, NestMiddleware } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { Test } from '@nestjs/testing';
import { RecordValidatorMiddleware } from '../common/middleware/record-validator.middleware';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { RecordType } from '../common/constants';
import { EnumTypeError } from '../common/errors';

describe('Record Validator Middleware', () => {
  let app: INestApplication;
  let recordValidatorMiddleware: NestMiddleware;
  let recordValidatorPrototype;
  const { res, next, clearMockRes } = getMockRes();

  const validId = 'id1234';
  const validRecordType = RecordType.Case;
  const validPath = `/${validRecordType}/${validId}/testendpoint`;
  const notinEnumPath = `/fjofijp/${validId}/testendpoint`;
  const incorrectFormatPath = 'abcdefg';
  const testIdir = 'IDIRTEST';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CacheModule.register(), ConfigModule.forRoot()],
      providers: [RecordValidatorMiddleware],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    recordValidatorMiddleware = app.get<NestMiddleware>(
      RecordValidatorMiddleware,
    );
    recordValidatorPrototype = Object.getPrototypeOf(recordValidatorMiddleware);
  });

  beforeEach(() => {
    clearMockRes();
  });

  describe('use function', () => {
    it('Should proceed to next function with no input errors', () => {
      const mockRequest = getMockReq({
        path: validPath,
        header: jest.fn((key: string): string => {
          const headerVal: { [key: string]: string } = {
            idir_username: testIdir,
          };
          return headerVal[key];
        }),
      });
      recordValidatorMiddleware.use(mockRequest, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('grabRecordInfoFromUrl function', () => {
    it('returns an array of [id, type] when the correct url format is passed', () => {
      const [id, recordType] =
        recordValidatorPrototype.grabRecordInfoFromUrl(validPath);
      expect(id).toEqual(validId);
      expect(recordType).toEqual(validRecordType);
    });

    it(`throws an error when the enum doesn't match the record type`, () => {
      expect(() => {
        recordValidatorPrototype.grabRecordInfoFromUrl(notinEnumPath);
      }).toThrow(EnumTypeError);
    });

    it(`throws an error when the url doesn't match the correct format`, () => {
      expect(() => {
        recordValidatorPrototype.grabRecordInfoFromUrl(incorrectFormatPath);
      }).toThrow(Error);
    });
  });
});
