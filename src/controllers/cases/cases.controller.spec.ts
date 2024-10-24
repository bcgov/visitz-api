import { Test, TestingModule } from '@nestjs/testing';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { SupportNetworkModule } from '../../helpers/support-network/support-network.module';
import { ConfigModule } from '@nestjs/config';

describe('CasesController', () => {
  let controller: CasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SupportNetworkModule, ConfigModule.forRoot()],
      providers: [CasesService],
      controllers: [CasesController],
    }).compile();

    controller = module.get<CasesController>(CasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
