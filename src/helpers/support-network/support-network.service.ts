import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  RecordEntityMap,
  RecordType,
} from '../../common/constants/enumerations';
import {
  CHILD_LINKS,
  VIEW_MODE,
  CONTENT_TYPE,
} from '../../common/constants/constants';
import { UtilitiesService } from '../utilities/utilities.service';
import {
  SupportNetworkEntity,
  NestedSupportNetworkEntity,
} from '../../entities/support-network.entity';
import { AxiosError } from 'axios';

@Injectable()
export class SupportNetworkService {
  url: string;
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    private utilitiesService: UtilitiesService,
  ) {
    this.url = (
      this.configService.get<string>('UPSTREAM_BASE_URL') +
      this.configService.get<string>('SUPPORT_NETWORK_ENDPOINT')
    ).replace(/\s/g, '%20');
  }

  async getSingleSupportNetworkInformationRecord(
    type: RecordType,
    id: string,
    since?: string,
  ) {
    let searchSpec = `([Entity Id]="${id}" AND [Entity Name]="${RecordEntityMap[type]}"`;
    let formattedDate: string | undefined;
    if (
      typeof since !== 'string' ||
      (formattedDate =
        this.utilitiesService.convertISODateToUpstreamFormat(since)) ===
        undefined
    ) {
      searchSpec = searchSpec + `)`;
    } else {
      searchSpec = searchSpec + ` AND [Updated] > "${formattedDate}")`;
    }
    const params = {
      ViewMode: VIEW_MODE,
      ChildLinks: CHILD_LINKS,
      searchspec: searchSpec,
    };
    const headers = {
      // TODO: Change the authorization to service account
      Cookie: this.configService.get<string>('SIEBEL_COOKIE'),
      Authorization: this.configService.get<string>('SIEBEL_BEARER_AUTH'),
      Accept: CONTENT_TYPE,
    };
    let response;
    try {
      response = await firstValueFrom(
        this.httpService.get(this.url, { params, headers }),
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        // TODO: Consider exposing certain codes to end user (404, etc.) while hiding others
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'There is no data for the requested resource',
          },
          HttpStatus.NOT_FOUND,
          { cause: error },
        );
      }
    }
    if ((response.data as object).hasOwnProperty('items')) {
      return new NestedSupportNetworkEntity(response.data);
    }
    return new SupportNetworkEntity(response.data);
  }
}
