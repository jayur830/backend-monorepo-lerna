import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { CompanyLogo } from '@/entities/company_logo.entity';
import { ResumeHistory } from '@/entities/resume_history.entity';
import { ResumeInfo } from '@/entities/resume_info.entity';

import { ResumeService } from './resume.service';

describe('ResumeService', () => {
  let service: ResumeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResumeService,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner() {
              return {
                connect: jest.fn(),
                startTransaction: jest.fn(),
                commitTransaction: jest.fn(),
                rollbackTransaction: jest.fn(),
                release: jest.fn(),
              };
            },
          },
        },
        {
          provide: getRepositoryToken(ResumeInfo),
          useValue: {
            find: jest.fn().mockResolvedValue([new ResumeInfo()]),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ResumeHistory),
          useValue: {
            find: jest.fn().mockResolvedValue([new ResumeHistory()]),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CompanyLogo),
          useValue: {
            find: jest.fn().mockResolvedValue([new CompanyLogo()]),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ResumeService>(ResumeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
