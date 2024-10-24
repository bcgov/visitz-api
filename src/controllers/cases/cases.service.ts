import { Injectable } from '@nestjs/common';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { RecordType } from '../../common/constants/enumerations';

@Injectable()
export class CasesService {
  constructor(private supportNetworkService: SupportNetworkService) {}

  getSingleCaseSupportNetworkInformationRecord(id: string, since?: string) {
    return this.supportNetworkService.getSingleSupportNetworkInformationRecord(
      RecordType.Case,
      id,
      since,
    );
  }
}
