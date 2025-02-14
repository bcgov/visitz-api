import { Test, TestingModule } from '@nestjs/testing';
import {
  UtilitiesService,
  isPastISO8601Date,
  isNotEmoji,
} from './utilities.service';
import { DateTime } from 'luxon';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getMockReq } from '@jest-mock/express';

describe('UtilitiesService', () => {
  let service: UtilitiesService;
  let jwtService: JwtService;

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
                skipJWTCache: false,
              };
              return lookup[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UtilitiesService>(UtilitiesService);
    jwtService = module.get<JwtService>(JwtService);
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

  describe('convertUpstreamDateFormatToDateTime tests', () => {
    it.each([
      ['2024-10-24T22:16:24+0000', '10/24/2024 22:16:24'],
      ['2024-10-24T22:16:24', '10/24/2024 22:16:24'],
      ['2024-W10-1T000000+0000', '03/04/2024 00:00:00'],
    ])(
      `should correctly format an MM/DD/YYYY HH:mm:ss format date to a DateTime object`,
      (expectedString, input) => {
        const expected = DateTime.fromISO(expectedString, { zone: 'UTC' });
        expect(
          service.convertUpstreamDateFormatToDateTime(input).toString(),
        ).toBe(expected.toString());
      },
    );

    it.each([['2024-31-12'], ['abcdefgtlom']])(
      `should return undefined on unexpected date format`,
      (input) => {
        expect(service.convertUpstreamDateFormatToDateTime(input)).toBe(
          undefined,
        );
      },
    );
  });

  describe('grabJTI tests', () => {
    it.each([[`cd529a83c49099f722bfb3e1f31fa01b`]])(
      `should return jti on valid jwt`,
      (jti) => {
        const jwt = jwtService.sign(`{"jti":"${jti}"}`, {
          secret: 'aTotalSecret',
        });
        const req = getMockReq({
          header: jest.fn((headerName) => {
            const lookup = { authorization: `Bearer ${jwt}` };
            return lookup[headerName];
          }),
        });
        expect(service.grabJTI(req)).toEqual(jti);
      },
    );

    it(`should return local when skipping jwt`, async () => {
      const localModule = await Test.createTestingModule({
        providers: [
          UtilitiesService,
          JwtService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn((key: string) => {
                const lookup = {
                  skipJWTCache: true,
                };
                return lookup[key];
              }),
            },
          },
        ],
      }).compile();

      const localService = localModule.get<UtilitiesService>(UtilitiesService);
      const req = getMockReq();
      expect(localService.grabJTI(req)).toEqual('local');
    });

    it.each([['invalidJWT']])(`should throw error on invalid JWT`, (jwt) => {
      const req = getMockReq({
        header: jest.fn((headerName) => {
          const lookup = { authorization: `Bearer ${jwt}` };
          return lookup[headerName];
        }),
      });
      expect(() => {
        service.grabJTI(req);
      }).toThrow(`Invalid JWT`);
    });
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

  describe('isNotEmoji tests', () => {
    it.each([
      [
        'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
      ],
      [
        `¿De dónde viene?\nAl contrario del pensamiento popular, el texto de Lorem Ipsum no es simplemente texto` +
          ` aleatorio. Tiene sus raices en una pieza cl´sica de la literatura del Latin, que data del año 45 antes de` +
          ` Cristo, haciendo que este adquiera mas de 2000 años de antiguedad. Richard McClintock, un profesor de Latin` +
          ` de la Universidad de Hampden-Sydney en Virginia, encontró una de las palabras más oscuras de la lengua del ` +
          `latín, "consecteur", en un pasaje de Lorem Ipsum, y al seguir leyendo distintos textos del latín, descubrió ` +
          `la fuente indudable. Lorem Ipsum viene de las secciones 1.10.32 y 1.10.33 de "de Finnibus Bonorum et Malorum" ` +
          `(Los Extremos del Bien y El Mal) por Cicero, escrito en el año 45 antes de Cristo. Este libro es un tratado de ` +
          `teoría de éticas, muy popular durante el Renacimiento. La primera linea del Lorem Ipsum, "Lorem ipsum dolor ` +
          `sit amet..", viene de una linea en la sección 1.10.32`,
      ],
      [
        'すみません、コンビニはどこですか？新幹線に乗って京都に行く前におやつを買いたいのですが。',
      ],
    ])(
      `should return the input string upon being given a string without emojis`,
      (input) => {
        expect(isNotEmoji(input)).toBe(input);
      },
    );

    it.each([
      ['Go Canada 🇨🇦!'],
      ['🤦🏼‍♀️🤦🏼🤦‍♀️'],
      ['It was very cold...🥶⛄️'],
      ['🂢☕︎Ω⚡︎'],
    ])(
      `should throw BadRequestException on text containing emojis`,
      (input) => {
        expect(() => {
          isNotEmoji(input);
        }).toThrow(BadRequestException);
      },
    );
  });
});
