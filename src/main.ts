import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { Logger as NestJSLogger } from '@nestjs/common';
import { versionRegexString } from './common/constants/parameter-constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  app.setGlobalPrefix(versionRegexString);

  const config = new DocumentBuilder()
    .setTitle('Visitz API')
    .setDescription('Middleware API for the MCFD Mobility app.')
    .setVersion('1.0')
    .addTag('visitz')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${versionRegexString}/api-spec`, app, documentFactory, {
    jsonDocumentUrl: `${versionRegexString}/api-spec/json`,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  const logger = new NestJSLogger();
  logger.log(`API is running on port: ${port}`, { port });
}
bootstrap();
