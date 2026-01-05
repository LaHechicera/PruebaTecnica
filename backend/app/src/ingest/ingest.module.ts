import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';
import { Record } from '../records/record.entity';

@Module({
  imports: [
    // Necesitamos acceder a la tabla records desde el servicio de ingesta
    TypeOrmModule.forFeature([Record]),
  ],
  controllers: [IngestController],
  providers: [IngestService],
})
export class IngestModule {}
