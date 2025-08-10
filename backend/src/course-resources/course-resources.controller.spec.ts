import { Test, TestingModule } from '@nestjs/testing';

import {
  CreateCourseResourceDto,
  FindCourseResourcesDto,
  UpdateCourseResourceDto,
} from './course-resource.dto';
import { CourseResource, ResourceType } from './course-resource.entity';
import { CourseResourcesController } from './course-resources.controller';
import {
  CourseResourcesService,
  PaginatedResult,
} from './course-resources.service';

describe('CourseResourcesController', () => {
  let controller: CourseResourcesController;
  let service: jest.Mocked<CourseResourcesService>;

  const mockCourseResource = {
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
  } as any;

  const mockPaginatedResult: PaginatedResult<CourseResource> = {
    data: [mockCourseResource],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      incrementDownloadCount: jest.fn(),
      toggleActive: jest.fn(),
      getResourcesByType: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseResourcesController],
      providers: [
        {
          provide: CourseResourcesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CourseResourcesController>(
      CourseResourcesController,
    );
    service = module.get(CourseResourcesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a course resource', async () => {
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

      service.create.mockResolvedValue(mockCourseResource);

      const result = await controller.create(courseId, createDto);

      expect(service.create).toHaveBeenCalledWith(courseId, createDto);
      expect(result).toEqual(mockCourseResource);
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

      service.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.findAll(courseId, findDto);

      expect(service.findAll).toHaveBeenCalledWith(courseId, findDto);
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('findOne', () => {
    it('should return a course resource', async () => {
      const courseId = 'course-id';
      const id = 'test-id';

      service.findOne.mockResolvedValue(mockCourseResource);

      const result = await controller.findOne(courseId, id);

      expect(service.findOne).toHaveBeenCalledWith(courseId, id);
      expect(result).toEqual(mockCourseResource);
    });
  });

  describe('update', () => {
    it('should update a course resource', async () => {
      const courseId = 'course-id';
      const id = 'test-id';
      const updateDto: UpdateCourseResourceDto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };

      const updatedResource = {
        ...mockCourseResource,
        ...updateDto,
      };

      service.update.mockResolvedValue(updatedResource);

      const result = await controller.update(courseId, id, updateDto);

      expect(service.update).toHaveBeenCalledWith(courseId, id, updateDto);
      expect(result).toEqual(updatedResource);
    });
  });

  describe('remove', () => {
    it('should remove a course resource', async () => {
      const courseId = 'course-id';
      const id = 'test-id';

      service.remove.mockResolvedValue(undefined);

      await controller.remove(courseId, id);

      expect(service.remove).toHaveBeenCalledWith(courseId, id);
    });
  });

  describe('incrementDownload', () => {
    it('should increment download count', async () => {
      const courseId = 'course-id';
      const id = 'test-id';

      service.incrementDownloadCount.mockResolvedValue(undefined);

      await controller.incrementDownload(courseId, id);

      expect(service.incrementDownloadCount).toHaveBeenCalledWith(courseId, id);
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

      service.toggleActive.mockResolvedValue(toggledResource);

      const result = await controller.toggleActive(courseId, id);

      expect(service.toggleActive).toHaveBeenCalledWith(courseId, id);
      expect(result).toEqual(toggledResource);
    });
  });

  describe('getResourcesByType', () => {
    it('should return resources filtered by type', async () => {
      const courseId = 'course-id';
      const type = ResourceType.PDF;

      service.getResourcesByType.mockResolvedValue([mockCourseResource]);

      const result = await controller.getResourcesByType(courseId, type);

      expect(service.getResourcesByType).toHaveBeenCalledWith(courseId, type);
      expect(result).toEqual([mockCourseResource]);
    });
  });
});
