import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
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
} from '../../common/constants/parameter-constants';
import { UtilitiesService } from '../utilities/utilities.service';
import {
  SupportNetworkEntity,
  NestedSupportNetworkEntity,
} from '../../entities/support-network.entity';
import { AxiosError } from 'axios';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { TokenRefresherService } from '../token-refresher/token-refresher.service';

@Injectable()
export class SupportNetworkService {
  url: string;
  private readonly logger = new Logger(SupportNetworkService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly utilitiesService: UtilitiesService,
    private readonly tokenRefresherService: TokenRefresherService,
  ) {
    this.url = (
      this.configService.get<string>('UPSTREAM_BASE_URL') +
      this.configService.get<string>('SUPPORT_NETWORK_ENDPOINT')
    ).replace(/\s/g, '%20');
  }

  async getSingleSupportNetworkInformationRecord(
    type: RecordType,
    id: IdPathParams,
    since?: SinceQueryParams,
  ) {
    let searchSpec = `([Entity Id]="${id.id}" AND [Entity Name]="${RecordEntityMap[type]}"`;
    let formattedDate: string | undefined;
    if (
      since === undefined ||
      typeof since.since !== 'string' ||
      (formattedDate = this.utilitiesService.convertISODateToUpstreamFormat(
        since.since,
      )) === undefined
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
      Accept: CONTENT_TYPE,
    };
    let response;
    try {
      const token =
        await this.tokenRefresherService.refreshUpstreamBearerToken();
      if (token === undefined) {
        throw new Error('Upstream auth failed');
      }
      headers['Authorization'] = token;
      response = await firstValueFrom(
        this.httpService.get(this.url, { params, headers }),
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(error.message, error.stack, error.cause);
        if (error.status === 404) {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: 'There is no data for the requested resource',
            },
            HttpStatus.NOT_FOUND,
            { cause: error },
          );
        }
      } else {
        this.logger.error(error);
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
    if ((response.data as object).hasOwnProperty('items')) {
      return new NestedSupportNetworkEntity(response.data);
    }
    return new SupportNetworkEntity(response.data);
  }
}
