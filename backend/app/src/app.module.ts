import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RecordsModule } from './records/records.module';
import { IngestModule } from './ingest/ingest.module';

@Module({
  imports: [
    // 1) Carga .env y lo deja disponible en toda la app
    ConfigModule.forRoot({ isGlobal: true }),

    // 2) Conecta TypeORM usando variables del .env
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true, // carga entidades registradas en módulos
        synchronize: false, // NO crear/alterar tablas automáticamente (usamos SQL)
      }),
    }),

    // 3) Módulo de autenticación (login JWT)
    AuthModule,

    RecordsModule,

    IngestModule,
  ],
  // 4) Controlador base (opcional, pero estándar en un proyecto Nest)
  controllers: [AppController],
  // 5) Servicio base (opcional, pero estándar en un proyecto Nest)
  providers: [AppService],
})
export class AppModule {}
