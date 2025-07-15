import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowsController } from './workflows.controller';

describe('WorkflowsController', () => {
  let controller: WorkflowsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowsController],
    }).compile();

    controller = module.get<WorkflowsController>(WorkflowsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
