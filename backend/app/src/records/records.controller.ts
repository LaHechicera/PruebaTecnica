import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RecordsService } from './records.service';

type CreateRecordDto = {
  sourceId: string;
  date: string;
  category: string;
  amount: number;
  status: string;
  description?: string;
};

@UseGuards(JwtAuthGuard)
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get()
  findAll() {
    return this.recordsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateRecordDto) {
    return this.recordsService.create(dto);
  }
}
