import { Injectable } from '@nestjs/common';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { RecordType } from '../../common/constants/enumerations';

@Injectable()
export class ServiceRequestsService {
  constructor(private supportNetworkService: SupportNetworkService) {}

  getSingleSRSupportNetworkInformationRecord(id: string, since?: string) {
    return this.supportNetworkService.getSingleSupportNetworkInformationRecord(
      RecordType.SR,
      id,
      since,
    );
  }
}
