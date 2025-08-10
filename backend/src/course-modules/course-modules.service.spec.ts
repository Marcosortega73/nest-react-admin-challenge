import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import {
  CreateCourseModuleDto,
  FindCourseModulesDto,
  ReorderCourseModulesDto,
  UpdateCourseModuleDto,
} from './course-module.dto';
import { CourseModule } from './course-module.entity';
import { CourseModulesService } from './course-modules.service';

describe('CourseModulesService', () => {
  let service: CourseModulesService;
  let repository: jest.Mocked<Repository<CourseModule>>;

  const mockCourseModule: CourseModule = {
    id: 'test-id',
    title: 'Test Module',
    description: 'Test Description',
    position: 1,
    isPublished: false,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    courseId: 'course-id',
    course: null,
    lessons: [],
    save: jest.fn(),
    remove: jest.fn(),
    softRemove: jest.fn(),
    recover: jest.fn(),
    reload: jest.fn(),
    hasId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseModulesService,
        {
          provide: getRepositoryToken(CourseModule),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CourseModulesService>(CourseModulesService);
    repository = module.get(getRepositoryToken(CourseModule));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create course module with auto-assigned position when position is not provided', async () => {
      const courseId = 'course-id';
      const createDto: CreateCourseModuleDto = {
        title: 'New Module',
        description: 'Description',
      };

      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ maxPosition: 2 }),
      };

      repository.createQueryBuilder.mockReturnValue(queryBuilder as any);
      repository.create.mockReturnValue({
        ...mockCourseModule,
        position: 3,
      } as any);
      repository.save.mockResolvedValue({
        ...mockCourseModule,
        position: 3,
      } as any);

      const result = await service.create(courseId, createDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        courseId,
        position: 3,
      });
      expect(result.position).toBe(3);
    });

    it('should throw BadRequestException on unique constraint violation', async () => {
      const courseId = 'course-id';
      const createDto: CreateCourseModuleDto = {
        title: 'New Module',
        position: 1,
      };

      const uniqueError = new QueryFailedError('query', [], {
        code: '23505',
        detail: 'Key (courseId, position)=(course-id, 1) already exists.',
      } as any);

      repository.create.mockReturnValue(mockCourseModule as any);
      repository.save.mockRejectedValue(uniqueError);

      await expect(service.create(courseId, createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated course modules ordered by position', async () => {
      const courseId = 'course-id';
      const query: FindCourseModulesDto = { page: 1, limit: 10 };
      const courseModules = [mockCourseModule];

      repository.findAndCount.mockResolvedValue([courseModules, 1]);

      const result = await service.findAll(courseId, query);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { courseId, isDeleted: false },
        order: { position: 'ASC' },
        skip: 0,
        take: 10,
      });

      expect(result).toEqual({
        data: courseModules,
        meta: { page: 1, limit: 10, total: 1 },
      });
    });
  });

  describe('findOne', () => {
    it('should return course module when found', async () => {
      const courseId = 'course-id';
      const id = 'module-id';

      repository.findOne.mockResolvedValue(mockCourseModule);

      const result = await service.findOne(courseId, id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id, courseId, isDeleted: false },
      });
      expect(result).toBe(mockCourseModule);
    });

    it('should throw NotFoundException when course module not found', async () => {
      const courseId = 'course-id';
      const id = 'non-existent-id';

      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(courseId, id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('publish/unpublish', () => {
    it('should publish course module', async () => {
      const courseId = 'course-id';
      const id = 'module-id';

      repository.findOne.mockResolvedValue(mockCourseModule);
      repository.save.mockResolvedValue({
        ...mockCourseModule,
        isPublished: true,
      } as any);

      const result = await service.publish(courseId, id);

      expect(result.isPublished).toBe(true);
    });
  });

  describe('delete', () => {
    it('should soft delete course module', async () => {
      const courseId = 'course-id';
      const id = 'module-id';

      repository.findOne.mockResolvedValue(mockCourseModule);
      repository.save.mockResolvedValue({
        ...mockCourseModule,
        isDeleted: true,
      } as any);

      await service.delete(courseId, id);

      expect(repository.save).toHaveBeenCalledWith({
        ...mockCourseModule,
        isDeleted: true,
      });
    });
  });
});
