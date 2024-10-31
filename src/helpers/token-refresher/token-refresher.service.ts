import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import { CONTENT_TYPE } from '../../common/constants/constants';

@Injectable()
export class TokenRefresherService {
  accessTokenUrl: string;
  clientId: string;
  clientSecret: string;
  private readonly logger = new Logger(TokenRefresherService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenUrl = this.configService.get('oauth.accessTokenUrl');
    this.clientId = this.configService.get('oauth.clientId');
    this.clientSecret = this.configService.get('oauth.clientSecret');
  }

  async refreshUpstreamBearerToken(): Promise<string | undefined> {
    let token: string | undefined, ttlMs: number | undefined;
    const key = 'visitzOauthToken';
    token = await this.cacheManager.get(key);
    if (typeof token === 'string') {
      return token;
    }
    // eslint-disable-next-line prefer-const
    [token, ttlMs] = await this.authenticateUpstream();
    if (token === undefined || ttlMs === undefined) {
      return undefined; // do not store bad result in cache
    }
    await this.cacheManager.set(key, token, ttlMs - 5000); // subtract time so it can be used upstream
    return token;
  }

  async authenticateUpstream(): Promise<
    [string, number] | [undefined, undefined]
  > {
    let response;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: CONTENT_TYPE,
    };
    const data = {
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: 'openid data',
    };

    try {
      response = await firstValueFrom(
        this.httpService.post(this.accessTokenUrl, data, { headers }),
      );
      const access_token = response.data['access_token'];
      const token_type = response.data['token_type'];
      const expirySeconds = response.data['expires_in'];
      if (
        typeof access_token !== 'string' ||
        typeof token_type != 'string' ||
        typeof expirySeconds != 'number'
      ) {
        throw new Error('Response data is invalid');
      }
      const bearer_token = token_type + ' ' + access_token;
      const expiryMs = expirySeconds * 1000;
      return [bearer_token, expiryMs];
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(error.message, error.stack, error.cause);
      }
      return [undefined, undefined];
    }
  }
}
