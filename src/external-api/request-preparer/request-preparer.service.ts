import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  VIEW_MODE,
  CHILD_LINKS,
  CONTENT_TYPE,
  PAGE_SIZE,
  RECORD_COUNT_NEEDED,
  recordCountHeaderName,
  UNIFORM_RESPONSE,
} from '../../common/constants/parameter-constants';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { TokenRefresherService } from '../token-refresher/token-refresher.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { StartRowNumQueryParams } from '../../dto/start-row-num-query-params.dto';
import { startRowNumParamName } from '../../common/constants/upstream-constants';

@Injectable()
export class RequestPreparerService {
  buildNumber: string;
  private readonly logger = new Logger(RequestPreparerService.name);
  constructor(
    private readonly utilitiesService: UtilitiesService,
    private readonly tokenRefresherService: TokenRefresherService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.buildNumber = this.configService.get<string>('buildInfo.buildNumber');
  }

  prepareHeadersAndParams(
    baseSearchSpec: string,
    workspace: string | undefined,
    sinceFieldName: string | undefined,
    since?: SinceQueryParams,
    startRowNum?: StartRowNumQueryParams,
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
      recordcountneeded: RECORD_COUNT_NEEDED,
      PageSize: PAGE_SIZE,
      uniformresponse: UNIFORM_RESPONSE,
    };
    if (typeof workspace !== 'undefined') {
      params['workspace'] = workspace;
    }
    if (
      startRowNum !== undefined &&
      typeof startRowNum.StartRowNum === 'number'
    ) {
      params[startRowNumParamName] = startRowNum.StartRowNum;
    }
    const headers = {
      Accept: CONTENT_TYPE,
    };
    return [headers, params];
  }

  async sendGetRequest(url: string, headers, res: Response, params?) {
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
        this.logger.error({
          msg: error.message,
          upstreamMsg: error.response?.data,
          stack: error.stack,
          cause: error.cause,
          buildNumber: this.buildNumber,
        });
        if (error.status === 404) {
          throw new HttpException({}, HttpStatus.NO_CONTENT, { cause: error });
        }
      } else {
        this.logger.error({ error, buildNumber: this.buildNumber });
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error:
            error.response?.data !== undefined
              ? error.response?.data
              : error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
    if (response.headers.hasOwnProperty(recordCountHeaderName)) {
      res.setHeader(
        recordCountHeaderName,
        response.headers[recordCountHeaderName],
      );
    }
    return response;
  }

  async sendPostRequest(url: string, body, headers, params?) {
    let response;
    try {
      const token =
        await this.tokenRefresherService.refreshUpstreamBearerToken();
      if (token === undefined) {
        throw new Error('Upstream auth failed');
      }
      headers['Authorization'] = token;
      response = await firstValueFrom(
        this.httpService.post(url, body, { params, headers }),
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error({
          msg: error.message,
          upstreamMsg: error.response?.data,
          stack: error.stack,
          cause: error.cause,
          buildNumber: this.buildNumber,
        });
        if (error.status === 404) {
          throw new HttpException({}, HttpStatus.NO_CONTENT, { cause: error });
        }
      } else {
        this.logger.error({ error, buildNumber: this.buildNumber });
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error:
            error.response?.data !== undefined
              ? error.response?.data
              : error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
    return response;
  }
}
