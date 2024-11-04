import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  RecordEntityMap,
  RecordType,
} from '../../common/constants/enumerations';
import {
  VIEW_MODE,
  CHILD_LINKS,
  CONTENT_TYPE,
} from '../../common/constants/parameter-constants';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { TokenRefresherService } from '../token-refresher/token-refresher.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class RequestPreparerService {
  private readonly logger = new Logger(RequestPreparerService.name);
  constructor(
    private readonly utilitiesService: UtilitiesService,
    private readonly tokenRefresherService: TokenRefresherService,
    private readonly httpService: HttpService,
  ) {}

  prepareHeadersAndParams(
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
    return [headers, params];
  }

  async sendGetRequest(url: string, headers, params?) {
    let response;
    try {
      const token =
        await this.tokenRefresherService.refreshUpstreamBearerToken();
      if (token === undefined) {
        throw new Error('Upstream auth failed');
      }
      headers['Authorization'] = token;
      response = await firstValueFrom(
        this.httpService.get(url, { params, headers }),
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
    return response;
  }
}
