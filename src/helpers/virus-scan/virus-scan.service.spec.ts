import { Test, TestingModule } from '@nestjs/testing';
import { VirusScanService } from './virus-scan.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../configuration/configuration';
import * as NodeClam from 'clamscan';
import { Readable } from 'stream';
import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';

describe('VirusScanService', () => {
  let service: VirusScanService;
  let file: Express.Multer.File;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [VirusScanService, ConfigService],
    }).compile();

    service = module.get<VirusScanService>(VirusScanService);
    file = {
      fieldname: '',
      originalname: '',
      encoding: '',
      mimetype: '',
      size: 6,
      stream: Readable.from(Buffer.from([11, 22, 33, 44, 55, 66])),
      destination: '',
      filename: '',
      path: '',
      buffer: Buffer.from([11, 22, 33, 44, 55, 66]),
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scanFile tests', () => {
    it('should return without error on a clean file', async () => {
      jest.spyOn(NodeClam.prototype, 'init').mockReturnValue();
      service.clamScan = new NodeClam();
      jest.spyOn(Readable, 'from').mockImplementationOnce(() => {
        return file.stream;
      });
      const scanSpy = jest
        .spyOn(service.clamScan, 'scanStream')
        .mockImplementationOnce(() => {
          return { file: null, isInfected: false, viruses: [] };
        });
      await service.scanFile(file);
      expect(scanSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw error on infected file', async () => {
      jest.spyOn(NodeClam.prototype, 'init').mockReturnValue();
      service.clamScan = new NodeClam();
      jest.spyOn(Readable, 'from').mockImplementationOnce(() => {
        return file.stream;
      });
      const scanSpy = jest
        .spyOn(service.clamScan, 'scanStream')
        .mockImplementationOnce(() => {
          return { file: null, isInfected: true, viruses: ['virus here'] };
        });
      await expect(service.scanFile(file)).rejects.toThrow(BadRequestException);
      expect(scanSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw error on null return from clamav', async () => {
      jest.spyOn(NodeClam.prototype, 'init').mockReturnValue();
      service.clamScan = new NodeClam();
      jest.spyOn(Readable, 'from').mockImplementationOnce(() => {
        return file.stream;
      });
      const scanSpy = jest
        .spyOn(service.clamScan, 'scanStream')
        .mockImplementationOnce(() => {
          return { file: null, isInfected: null, viruses: [] };
        });
      await expect(service.scanFile(file)).rejects.toThrow(
        UnprocessableEntityException,
      );
      expect(scanSpy).toHaveBeenCalledTimes(1);
    });
  });
});
