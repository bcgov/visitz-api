import { Test, TestingModule } from '@nestjs/testing';
import { UtilitiesService } from './utilities.service';

describe('UtilitiesService', () => {
  let service: UtilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilitiesService],
    }).compile();

    service = module.get<UtilitiesService>(UtilitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertISODateToUpstreamFormat tests', () => {
    it.each([
      ['2024-10-24T22:16:24+0000', '10/24/2024 22:16:24'],
      ['2024-10-24T22:16:24-0100', '10/24/2024 23:16:24'],
    ])(
      `should format an ISO-8601 Date to format MM/DD/YYYY HH:mm:ss in UTC`,
      (input, expected) => {
        expect(service.convertISODateToUpstreamFormat(input)).toBe(expected);
      },
    );

    it.each([
      // ['2024-31-12'],
      ['abcdefgtlom'],
    ])(`should return undefined on unexpected date format`, (input) => {
      expect(service.convertISODateToUpstreamFormat(input)).toBe(undefined);
    });
  });
});
