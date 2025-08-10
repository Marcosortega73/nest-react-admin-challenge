import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import {
  CreateCourseResourceDto,
  FindCourseResourcesDto,
  UpdateCourseResourceDto,
} from './course-resource.dto';
import { CourseResource, ResourceType } from './course-resource.entity';
import { CourseResourcesService } from './course-resources.service';

describe('CourseResourcesService', () => {
  let service: CourseResourcesService;
  let repository: jest.Mocked<Repository<CourseResource>>;

  const mockCourseResource: CourseResource = {
    id: 'test-id',
    title: 'Test Resource',
    description: 'Test Description',
    type: ResourceType.PDF,
    url: 'https://example.com/resource.pdf',
    fileSize: 1024,
    mimeType: 'application/pdf',
    downloadCount: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    courseId: 'course-id',
    course: null,
  } as CourseResource;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseResourcesService,
        {
          provide: getRepositoryToken(CourseResource),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CourseResourcesService>(CourseResourcesService);
    repository = module.get(getRepositoryToken(CourseResource));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a course resource successfully', async () => {
      const courseId = 'course-id';
      const createDto: CreateCourseResourceDto = {
        title: 'Test Resource',
        description: 'Test Description',
        type: ResourceType.PDF,
        url: 'https://example.com/resource.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        isActive: true,
      };

      repository.create.mockReturnValue(mockCourseResource as any);
      repository.save.mockResolvedValue(mockCourseResource as any);

      const result = await service.create(courseId, createDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        courseId,
        downloadCount: 0,
        isActive: true,
      });
      expect(repository.save).toHaveBeenCalledWith(mockCourseResource);
      expect(result).toEqual(mockCourseResource);
    });

    it('should handle unique violation errors', async () => {
      const courseId = 'course-id';
      const createDto: CreateCourseResourceDto = {
        title: 'Test Resource',
        type: ResourceType.PDF,
        url: 'https://example.com/resource.pdf',
      };

      const uniqueError = new QueryFailedError(
        'query',
        [],
        new Error('duplicate key'),
      );
      (uniqueError as any).driverError = { code: '23505' };

      repository.create.mockReturnValue(mockCourseResource as any);
      repository.save.mockRejectedValue(uniqueError);

      await expect(service.create(courseId, createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated course resources', async () => {
      const courseId = 'course-id';
      const findDto: FindCourseResourcesDto = {
        page: 1,
        limit: 10,
        title: 'Test',
      };

      const mockData = [mockCourseResource];
      const mockTotal = 1;

      repository.findAndCount.mockResolvedValue([mockData, mockTotal] as any);

      const result = await service.findAll(courseId, findDto);

      expect(result).toEqual({
        data: mockData,
        total: mockTotal,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should apply filters correctly', async () => {
      const courseId = 'course-id';
      const findDto: FindCourseResourcesDto = {
        title: 'Test',
        type: ResourceType.PDF,
        isActive: true,
      };

      repository.findAndCount.mockResolvedValue([[], 0] as any);

      await service.findAll(courseId, findDto);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: expect.objectContaining({
          courseId,
          type: ResourceType.PDF,
          isActive: true,
        }),
        order: {
          createdAt: 'DESC',
          title: 'ASC',
        },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a course resource', async () => {
      const courseId = 'course-id';
      const id = 'test-id';

      repository.findOne.mockResolvedValue(mockCourseResource as any);

      const result = await service.findOne(courseId, id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id, courseId },
      });
      expect(result).toEqual(mockCourseResource);
    });

    it('should throw NotFoundException when resource not found', async () => {
      const courseId = 'course-id';
      const id = 'non-existent-id';

      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(courseId, id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a course resource successfully', async () => {
      const courseId = 'course-id';
      const id = 'test-id';
      const updateDto: UpdateCourseResourceDto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };

      repository.findOne.mockResolvedValue(mockCourseResource as any);
      repository.save.mockResolvedValue({
        ...mockCourseResource,
        ...updateDto,
      } as any);

      const result = await service.update(courseId, id, updateDto);

      expect(result.title).toBe('Updated Title');
      expect(result.description).toBe('Updated Description');
    });

    it('should throw NotFoundException when resource not found', async () => {
      const courseId = 'course-id';
      const id = 'non-existent-id';
      const updateDto: UpdateCourseResourceDto = {
        title: 'Updated Title',
      };

      repository.findOne.mockResolvedValue(null);

      await expect(service.update(courseId, id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a course resource successfully', async () => {
      const courseId = 'course-id';
      const id = 'test-id';

      repository.findOne.mockResolvedValue(mockCourseResource as any);
      repository.remove.mockResolvedValue(mockCourseResource as any);

      await service.remove(courseId, id);

      expect(repository.remove).toHaveBeenCalledWith(mockCourseResource);
    });

    it('should throw NotFoundException when resource not found', async () => {
      const courseId = 'course-id';
      const id = 'non-existent-id';

      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(courseId, id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('incrementDownloadCount', () => {
    it('should increment download count', async () => {
      const courseId = 'course-id';
      const id = 'test-id';
      const resourceWithIncrementedCount = {
        ...mockCourseResource,
        downloadCount: 1,
      };

      repository.findOne.mockResolvedValue(mockCourseResource as any);
      repository.save.mockResolvedValue(resourceWithIncrementedCount as any);

      await service.incrementDownloadCount(courseId, id);

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          downloadCount: 1,
        }),
      );
    });
  });

  describe('toggleActive', () => {
    it('should toggle active status', async () => {
      const courseId = 'course-id';
      const id = 'test-id';
      const toggledResource = {
        ...mockCourseResource,
        isActive: false,
      };

      repository.findOne.mockResolvedValue(mockCourseResource as any);
      repository.save.mockResolvedValue(toggledResource as any);

      const result = await service.toggleActive(courseId, id);

      expect(result.isActive).toBe(false);
    });
  });

  describe('getResourcesByType', () => {
    it('should return resources filtered by type', async () => {
      const courseId = 'course-id';
      const type = ResourceType.PDF;

      repository.find.mockResolvedValue([mockCourseResource] as any);

      const result = await service.getResourcesByType(courseId, type);

      expect(repository.find).toHaveBeenCalledWith({
        where: { courseId, type, isActive: true },
        order: { title: 'ASC' },
      });
      expect(result).toEqual([mockCourseResource]);
    });
  });
});
