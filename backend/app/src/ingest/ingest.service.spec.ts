import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IngestService } from './ingest.service';
import { Record } from '../records/record.entity';

describe('IngestService', () => {
  let service: IngestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestService,
        {
          provide: getRepositoryToken(Record),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn((x) => x),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IngestService>(IngestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
