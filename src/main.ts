import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = new Logger('Bootstrap')
  const configService = app.get(ConfigService)

  app.setGlobalPrefix('api')

  app.enableCors({
    origin: ['http://localhost:3000', process.env.FRONTEND_URL ?? 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Loans Portal API')
    .setDescription('API del portal de contratación de productos de inversión')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, document)

  const port = configService.get<number>('PORT', 3001)
  await app.listen(port)

  logger.log(`Server running on http://localhost:${port}`)
  logger.log(`Swagger docs: http://localhost:${port}/api/docs`)
}

bootstrap()
