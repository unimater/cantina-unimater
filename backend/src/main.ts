import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './env';
import { ValidationPipe } from '@nestjs/common'; // ✅ Import do ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Ativa a validação global (necessário para DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos que não estão no DTO
      forbidNonWhitelisted: true, // Gera erro se o front enviar algo fora do DTO
      transform: true, // Converte automaticamente tipos (string → number, boolean etc)
    }),
  );

  // ✅ Habilita CORS
  app.enableCors({
    origin: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With',
      'Origin',
    ],
    credentials: true,
  });

  // ✅ Obtém a porta do .env
  const configService = app.get<ConfigService<Env, true>>(ConfigService);
  const port = configService.get('PORT', { infer: true });

  await app.listen(port || 3000);
  console.log(`🚀 Servidor rodando em http://localhost:${port || 3000}`);
}

bootstrap();
