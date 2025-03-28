import * as loadEsm from 'load-esm';
import { FileTypeMagicNumberValidatorPipe } from './file-validators';
import { Readable } from 'stream';
import { BadRequestException } from '@nestjs/common';

describe('FileValidators', () => {
  let fileTypeValidator: FileTypeMagicNumberValidatorPipe;
  beforeEach(async () => {
    fileTypeValidator = new FileTypeMagicNumberValidatorPipe();
  });

  it('should be defined', () => {
    expect(fileTypeValidator).toBeDefined();
  });

  describe('loadFileTypeModule tests', () => {
    it('should only load the module once', async () => {
      const loadSpy = jest.spyOn(loadEsm, 'loadEsm');
      const fileTypeSpy = jest.spyOn(fileTypeValidator, 'loadFileTypeModule');
      await fileTypeValidator.loadFileTypeModule();
      await fileTypeValidator.loadFileTypeModule();
      expect(fileTypeSpy).toHaveBeenCalledTimes(2);
      expect(loadSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('transform tests', () => {
    it('should return file on good input', async () => {
      const file = {
        fieldname: '',
        originalname: 'filename.png',
        encoding: '',
        mimetype: 'image/png',
        size: 6,
        stream: Readable.from(Buffer.from([11, 22, 33, 44, 55, 66])),
        destination: '',
        filename: '',
        path: '',
        buffer: Buffer.from([11, 22, 33, 44, 55, 66]),
      } as Express.Multer.File;
      await fileTypeValidator.loadFileTypeModule();
      const fileTypeSpy = jest
        .spyOn(fileTypeValidator, 'fileTypeFunction')
        .mockResolvedValueOnce({ mime: 'image/png' });
      const returnValue = await fileTypeValidator.transform(file);
      expect(fileTypeSpy).toHaveBeenCalledTimes(1);
      expect(returnValue).toBe(file);
    });

    it('should throw BadRequestException on bad input', async () => {
      const file = {
        fieldname: '',
        originalname: 'filename.svg',
        encoding: '',
        mimetype: 'image/svg',
        size: 6,
        stream: Readable.from(Buffer.from([11, 22, 33, 44, 55, 66])),
        destination: '',
        filename: '',
        path: '',
        buffer: Buffer.from([11, 22, 33, 44, 55, 66]),
      } as Express.Multer.File;
      await fileTypeValidator.loadFileTypeModule();
      const fileTypeSpy = jest
        .spyOn(fileTypeValidator, 'fileTypeFunction')
        .mockResolvedValueOnce({ mime: 'image/svf' });
      await expect(fileTypeValidator.transform(file)).rejects.toThrow(
        BadRequestException,
      );
      expect(fileTypeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
