import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { Logger as NestJSLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  const config = new DocumentBuilder()
    .setTitle('Visitz API')
    .setDescription('Middleware API for the MCFD Mobility app.')
    .setVersion('1.0')
    .addTag('visitz')
    .addOAuth2(
      {
        type: 'oauth2',
        description:
          'OAuth2.0 used for access on the server. Not required for local development.',
        // scheme?: string;
        // bearerFormat?: string;
        flows: {
          authorizationCode: {
            authorizationUrl: 'url here?',
            tokenUrl: 'url here?',
            scopes: {
              'do we specify this': '??',
            },
          },
        },
        // Technically, shouldn't this be OIDC instead? Not sure if we have all the info for this right now
        // openIdConnectUrl?: string;
      },
      'Server Auth',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-spec', app, documentFactory, {
    jsonDocumentUrl: 'api-spec/json',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  const logger = new NestJSLogger();
  logger.log(`API is running on port: ${port}`, { port });
}
bootstrap();
