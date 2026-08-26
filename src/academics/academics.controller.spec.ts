// src/academics/academics.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AcademicsService } from './academics.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { AttendanceStatus, AttendanceType } from '@prisma/client';

describe('AcademicsService', () => {
  let service: AcademicsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    student: {
      findUnique: jest.fn(),
    },
    attendanceLog: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcademicsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AcademicsService>(AcademicsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('recordAttendance', () => {
    it('should successfully record attendance when student exists', async () => {
      const dto = {
        studentId: 'student-1',
        status: AttendanceStatus.PRESENT,
        type: AttendanceType.LECTURE,
        termId: 'term-1',
        date: '2026-08-17T15:00:00.000Z',
      };

      mockPrismaService.student.findUnique.mockResolvedValue({
        id: 'student-1',
      });
      mockPrismaService.attendanceLog.create.mockResolvedValue({
        id: 'log-1',
        ...dto,
      });

      const result = await service.recordAttendance(dto);
      expect(result).toBeDefined();
      expect(mockPrismaService.student.findUnique).toHaveBeenCalledWith({
        where: { id: 'student-1' },
      });
      expect(mockPrismaService.attendanceLog.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if student does not exist', async () => {
      const dto = {
        studentId: 'invalid-id',
        status: AttendanceStatus.PRESENT,
        type: AttendanceType.LECTURE,
        termId: 'term-1',
      };

      mockPrismaService.student.findUnique.mockResolvedValue(null);

      await expect(service.recordAttendance(dto as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllAttendance', () => {
    it('should return an array of attendance records', async () => {
      const expectedLogs = [{ id: 'log-1' }, { id: 'log-2' }];
      mockPrismaService.attendanceLog.findMany.mockResolvedValue(expectedLogs);

      const result = await service.findAllAttendance();
      expect(result).toEqual(expectedLogs);
      expect(mockPrismaService.attendanceLog.findMany).toHaveBeenCalled();
    });
  });
});
