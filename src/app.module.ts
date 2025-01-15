import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './configuration/configuration';
import { CommonModule } from './common/common.module';
import { ControllersModule } from './controllers/controllers.module';
import { HelpersModule } from './helpers/helpers.module';
import { LoggerModule } from 'nestjs-pino';
import { CacheModule } from '@nestjs/cache-manager';
import { ExternalApiModule } from './external-api/external-api.module';
import {
  wrapRequestSerializer,
  wrapResponseSerializer,
} from 'pino-std-serializers';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          customSuccessObject: (req, res, loggableObject) => {
            return {
              ...loggableObject,
              res,
              buildNumber: configService.get('buildInfo.buildNumber'),
            };
          },
          customErrorObject: (req, res, loggableObject) => {
            return {
              ...loggableObject,
              res,
              buildNumber: configService.get('buildInfo.buildNumber'),
            };
          },
          customReceivedObject: (req, res, loggableObject) => {
            return {
              ...loggableObject,
              buildNumber: configService.get('buildInfo.buildNumber'),
              msg: 'Request received',
            };
          },
          serializers: {
            req: wrapRequestSerializer((req) => {
              return {
                id: req.raw.id,
                method: req.raw.method,
                path: req.raw.url,
                query: req.query,
                params: req.params,
                // Allowlist useful headers
                headers: {
                  host: req.raw.headers.host,
                  connection: req.raw.headers.connection,
                  'x-forwarded-proto': req.raw.headers['x-forwarded-proto'],
                  'x-forwarded-host': req.raw.headers['x-forwarded-host'],
                  'x-forwarded-port': req.raw.headers['x-forwarded-port'],
                  'x-forwarded-path': req.raw.headers['x-forwarded-path'],
                  'x-real-ip': req.raw.headers['x-real-ip'],
                  'user-agent': req.raw.headers['user-agent'],
                  accept: req.raw.headers.accept,
                  'accept-language': req.raw.headers['accept-language'],
                  'x-credential-identifier':
                    req.raw.headers['x-credential-identifier'],
                  'x-idir-username': req.raw.headers['x-idir-username'],
                  'x-authenticated-groups':
                    req.raw.headers['x-authenticated-groups'],
                  'kong-request-id': req.raw.headers['kong-request-id'],
                  referer: req.raw.headers.referer,
                },
                remoteAddress: req.remoteAddress,
                remotePort: req.remotePort,
              };
            }),
            res: wrapResponseSerializer((res) => {
              return {
                statusCode: res.raw.statusCode,
                headers: res.headers,
              };
            }),
          },
        },
      }),
    }),
    CacheModule.register({ isGlobal: true }),
    CommonModule,
    ControllersModule,
    HelpersModule,
    ExternalApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
