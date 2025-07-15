import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import IORedis from 'ioredis';
import * as session from 'express-session';
import { ms, StringValue } from './libs/utils/ms.util';
import { parseBoolean } from './libs/utils/parse-boolean.util';
import { RedisStore } from 'connect-redis';





async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const redis = new IORedis(config.getOrThrow('REDIS_URI'));
  app.use(cookieParser(config.getOrThrow('COOKIE_SECRET')));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.use((session as any)({
    secret: config.getOrThrow('SESSION_SECRET'),
    name: config.getOrThrow('SESSION_NAME'),
    resave: true,
    saveUninitialized: false,
    cookie: {
      domain: config.getOrThrow('SESSION_DOMAIN'),
      maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
      httpOnly: parseBoolean(config.getOrThrow('SESSION_HTTP_ONLY')),
      secure: parseBoolean(config.getOrThrow('SESSION_SECURE')),
      sameSite: 'lax',
    },
    store: new RedisStore({
      client: redis,
      prefix: config.getOrThrow('SESSION_FOLDER'),
    }),
  })
  );
  app.enableCors({
    origin: config.getOrThrow('ALLOWED_ORIGINS'),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  await app.listen(process.env.APPLICATION_PORT ?? 3000);
}
bootstrap();
