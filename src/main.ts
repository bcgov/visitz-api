import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { Logger as NestJSLogger, VersioningType } from '@nestjs/common';
import { versionNumber } from './common/constants/parameter-constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    // httpsOptions: {
    //   key: process.env.SERVER_KEY.trim(),
    //   cert: [process.env.SERVER_CERT.trim()],
    //   ca: process.env.CA_CERT.trim(),
    //   requestCert: true,
    //   rejectUnauthorized: true,
    // },
  });
  app.useLogger(app.get(Logger));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: versionNumber,
  });

  const config = new DocumentBuilder()
    .setTitle('Visitz API')
    .setDescription('Middleware API for the MCFD Mobility app.')
    .setVersion('1.0')
    .addTag('visitz')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`v${versionNumber}/api-spec`, app, documentFactory, {
    jsonDocumentUrl: `v${versionNumber}/api-spec/json`,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  const logger = new NestJSLogger();
  logger.log(`API is running on port: ${port}`, { port });
}
bootstrap();
