import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  VIEW_MODE,
  CHILD_LINKS,
  CONTENT_TYPE,
  recordCountHeaderName,
  UNIFORM_RESPONSE,
  sinceParamName,
  uniformResponseParamName,
} from '../../common/constants/parameter-constants';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { TokenRefresherService } from '../token-refresher/token-refresher.service';
import { HttpService } from '@nestjs/axios';
import {
  catchError,
  firstValueFrom,
  forkJoin,
  lastValueFrom,
  Observable,
  of,
} from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import {
  pageSizeParamName,
  recordCountNeededParamName,
  startRowNumParamName,
  trustedIdirHeaderName,
} from '../../common/constants/upstream-constants';
import { RecordCountNeededEnum } from '../../common/constants/enumerations';
import { GetRequestDetails } from '../../dto/get-request-details.dto';
import { ParalellResponse } from '../../dto/parallel-response.dto';

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
    uniformResponse: boolean,
    idir: string,
    filter?: FilterQueryParams,
  ) {
    let searchSpec = baseSearchSpec;
    let formattedDate: string | undefined;
    if (
      sinceFieldName === undefined ||
      filter === undefined ||
      typeof filter[sinceParamName] !== 'string' ||
      (formattedDate = this.utilitiesService.convertISODateToUpstreamFormat(
        filter[sinceParamName],
      )) === undefined
    ) {
      searchSpec = searchSpec + `)`;
    } else {
      searchSpec =
        searchSpec + ` AND [${sinceFieldName}] > "${formattedDate}")`;
    }
    if (baseSearchSpec === '') {
      searchSpec = searchSpec.replace(')', '').replace(' AND ', '');
    }
    const params = {
      ViewMode: VIEW_MODE,
      ChildLinks: CHILD_LINKS,
      searchspec: searchSpec,
    };
    if (uniformResponse === true) {
      params[uniformResponseParamName] = UNIFORM_RESPONSE;
    }
    if (typeof workspace !== 'undefined' && workspace.trim() !== '') {
      params['workspace'] = workspace;
    }
    if (filter !== undefined) {
      if (filter[recordCountNeededParamName] === RecordCountNeededEnum.True) {
        params[recordCountNeededParamName] = filter[recordCountNeededParamName];
      }
      if (typeof filter[pageSizeParamName] === 'number') {
        params[pageSizeParamName] = filter[pageSizeParamName];
      }
      if (typeof filter[startRowNumParamName] === 'number') {
        params[startRowNumParamName] = filter[startRowNumParamName];
      }
    }
    const headers = {
      Accept: CONTENT_TYPE,
      'Accept-Encoding': '*',
      [trustedIdirHeaderName]: idir,
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
          errorDetails: error.response?.data,
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
          errorDetails: error.response?.data,
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

  async parallelGetRequest(
    requestSpecs: Array<GetRequestDetails>,
  ): Promise<ParalellResponse> {
    let response: ParalellResponse;
    try {
      const authToken =
        await this.tokenRefresherService.refreshUpstreamBearerToken();
      if (authToken === undefined) {
        throw new Error('Upstream auth failed');
      }
      for (const req of requestSpecs) {
        req.headers['Authorization'] = authToken;
      }
    } catch (error) {
      this.logger.error({ error, buildNumber: this.buildNumber });
      response = new ParalellResponse({
        overallError: new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: error },
        ),
      });
      return response;
    }

    const requestArray: Array<Observable<any>> = [];
    for (const req of requestSpecs) {
      requestArray.push(
        this.httpService
          .get(req.url, {
            params: req.params,
            headers: req.headers,
          })
          .pipe(catchError((err) => of(err))),
      );
    }
    const parallelObservable = forkJoin(requestArray);
    const outputArray = await lastValueFrom(parallelObservable);
    return new ParalellResponse({ responses: outputArray });
  }
}
