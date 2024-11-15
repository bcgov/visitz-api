import { Test, TestingModule } from '@nestjs/testing';
import { MemosController } from './memos.controller';
// import { AuthService } from '../../common/guards/auth/auth.service';

describe('MemosController', () => {
  let controller: MemosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemosController],
      // providers: [AuthService],
    }).compile();

    controller = module.get<MemosController>(MemosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
