import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  VIEW_MODE,
  CHILD_LINKS,
  CONTENT_TYPE,
  PAGINATION,
} from '../../common/constants/parameter-constants';
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
    baseSearchSpec: string,
    workspace: string | undefined,
    sinceFieldName: string | undefined,
    since?: SinceQueryParams,
  ) {
    let searchSpec = baseSearchSpec;
    let formattedDate: string | undefined;
    if (
      sinceFieldName === undefined ||
      since === undefined ||
      typeof since.since !== 'string' ||
      (formattedDate = this.utilitiesService.convertISODateToUpstreamFormat(
        since.since,
      )) === undefined
    ) {
      searchSpec = searchSpec + `)`;
    } else {
      searchSpec =
        searchSpec + ` AND [${sinceFieldName}] > "${formattedDate}")`;
    }
    const params = {
      ViewMode: VIEW_MODE,
      ChildLinks: CHILD_LINKS,
      searchspec: searchSpec,
      pagination: PAGINATION,
    };
    if (typeof workspace !== 'undefined') {
      params['workspace'] = workspace;
    }
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
