import { plainToInstance } from 'class-transformer';
import { PostSupportNetworkDto } from './post-support-network.dto';

describe('PostSupportNetworkDto transform tests', () => {
  it.each([
    [
      {
        Name: 'Test',
        Phone: '1234567890',
        Cell: '1234567890123456789012345678901234567890',
        Address: '1234-5678 A street, Vancouver',
        Relationship: 'Relationship',
        'Agency Name': 'Test Agency',
        Comments: 'Comments',
        Active: 'Yes',
      },
    ],
  ])(`should validate given fields`, (data) => {
    const postSupportNetworkDto = plainToInstance(PostSupportNetworkDto, data);
    expect(postSupportNetworkDto).toEqual(data);
  });
  it.each([[{ Name: 'test' }]])(
    `should ignore optional field validation when not given`,
    (data) => {
      const postSupportNetworkDto = plainToInstance(
        PostSupportNetworkDto,
        data,
      );
      expect(postSupportNetworkDto['Name']).toBe(data.Name);
    },
  );
});
