import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Record } from './record.entity';

type CreateRecordDto = {
  sourceId: string;
  date: string;
  category: string;
  amount: number;
  status: string;
  description?: string;
};

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private readonly recordsRepo: Repository<Record>,
  ) {}

  // 1) Listar todos los records
  findAll() {
    return this.recordsRepo.find({
      order: { id: 'DESC' },
    });
  }

  // 2) Crear un record
  create(dto: CreateRecordDto) {
    const entity = this.recordsRepo.create(dto);
    return this.recordsRepo.save(entity);
  }
}
