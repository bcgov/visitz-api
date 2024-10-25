import { Injectable } from '@nestjs/common';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { RecordType } from '../../common/constants/enumerations';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
} from '../../entities/support-network.entity';

@Injectable()
export class CasesService {
  constructor(private supportNetworkService: SupportNetworkService) {}

  getSingleCaseSupportNetworkInformationRecord(
    id: string,
    since?: string,
  ): Promise<SupportNetworkEntity | NestedSupportNetworkEntity> {
    return this.supportNetworkService.getSingleSupportNetworkInformationRecord(
      RecordType.Case,
      id,
      since,
    );
  }
}
