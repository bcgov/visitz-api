import { Test, TestingModule } from '@nestjs/testing';
import { UtilitiesService, isPastISO8601Date } from './utilities.service';
import { DateTime } from 'luxon';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('UtilitiesService', () => {
  let service: UtilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UtilitiesService,
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const lookup = {
                skipJWT: true,
              };
              return lookup[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UtilitiesService>(UtilitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertISODateToUpstreamFormat tests', () => {
    it.each([
      ['2024-10-24T22:16:24+0000', '10/24/2024 22:16:24'],
      ['2024-10-24T22:16:24', '10/24/2024 22:16:24'],
      ['   2024-W10-1T000000+0000   ', '03/04/2024 00:00:00'],
    ])(
      `should format an ISO-8601 Date to format MM/DD/YYYY HH:mm:ss in UTC`,
      (input, expected) => {
        expect(service.convertISODateToUpstreamFormat(input)).toBe(expected);
      },
    );

    it.each([['2024-31-12'], ['abcdefgtlom']])(
      `should return undefined on unexpected date format`,
      (input) => {
        expect(service.convertISODateToUpstreamFormat(input)).toBe(undefined);
      },
    );
  });

  describe('isPastISO8601Date tests', () => {
    it.each([[DateTime.now().toUTC().minus(60000).toJSDate().toISOString()]])(
      `should return a string upon being given a past ISO-8601 date`,
      (input) => {
        expect(typeof isPastISO8601Date(input)).toBe('string');
      },
    );

    it.each([
      [DateTime.now().toUTC().plus(600000).toJSDate().toISOString()],
      ['abcdefgtlom'],
    ])(
      `should throw BadRequestException on future date or unexpected input format`,
      (input) => {
        expect(() => {
          isPastISO8601Date(input);
        }).toThrow(BadRequestException);
      },
    );
  });
});
