import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { Record } from './record.entity';

@Module({
  imports: [
    // Hace disponible Repository<Record> para el servicio
    TypeOrmModule.forFeature([Record]),
  ],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
