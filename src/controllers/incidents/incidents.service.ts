import { Injectable } from '@nestjs/common';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { RecordType } from '../../common/constants/enumerations';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
} from '../../entities/support-network.entity';

@Injectable()
export class IncidentsService {
  constructor(private supportNetworkService: SupportNetworkService) {}

  getSingleIncidentSupportNetworkInformationRecord(
    id: string,
    since?: string,
  ): Promise<SupportNetworkEntity | NestedSupportNetworkEntity> {
    return this.supportNetworkService.getSingleSupportNetworkInformationRecord(
      RecordType.Incident,
      id,
      since,
    );
  }
}
