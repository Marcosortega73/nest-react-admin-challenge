import { Test, TestingModule } from '@nestjs/testing';

import {
  CreateCourseModuleDto,
  FindCourseModulesDto,
  ReorderCourseModulesDto,
  UpdateCourseModuleDto,
} from './course-module.dto';
import { CourseModule } from './course-module.entity';
import { CourseModulesController } from './course-modules.controller';
import {
  CourseModulesService,
  PaginatedResult,
} from './course-modules.service';

describe('CourseModulesController', () => {
  let controller: CourseModulesController;
  let service: jest.Mocked<CourseModulesService>;

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

  const mockPaginatedResult: PaginatedResult<CourseModule> = {
    data: [mockCourseModule],
    meta: { page: 1, limit: 20, total: 1 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseModulesController],
      providers: [
        {
          provide: CourseModulesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            reorder: jest.fn(),
            publish: jest.fn(),
            unpublish: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CourseModulesController>(CourseModulesController);
    service = module.get(CourseModulesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new course module', async () => {
      const courseId = 'course-id';
      const createDto: CreateCourseModuleDto = {
        title: 'New Module',
        description: 'Description',
      };

      service.create.mockResolvedValue(mockCourseModule);

      const result = await controller.create(courseId, createDto);

      expect(service.create).toHaveBeenCalledWith(courseId, createDto);
      expect(result).toBe(mockCourseModule);
    });
  });

  describe('findAll', () => {
    it('should return paginated course modules', async () => {
      const courseId = 'course-id';
      const query: FindCourseModulesDto = { page: 1, limit: 20 };

      service.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.findAll(courseId, query);

      expect(service.findAll).toHaveBeenCalledWith(courseId, query);
      expect(result).toBe(mockPaginatedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single course module', async () => {
      const courseId = 'course-id';
      const id = 'module-id';

      service.findOne.mockResolvedValue(mockCourseModule);

      const result = await controller.findOne(courseId, id);

      expect(service.findOne).toHaveBeenCalledWith(courseId, id);
      expect(result).toBe(mockCourseModule);
    });
  });

  describe('update', () => {
    it('should update a course module', async () => {
      const courseId = 'course-id';
      const id = 'module-id';
      const updateDto: UpdateCourseModuleDto = {
        title: 'Updated Module',
      };

      const updatedCourseModule = { ...mockCourseModule, ...updateDto };
      service.update.mockResolvedValue(updatedCourseModule as any);

      const result = await controller.update(courseId, id, updateDto);

      expect(service.update).toHaveBeenCalledWith(courseId, id, updateDto);
      expect(result).toBe(updatedCourseModule);
    });
  });

  describe('publish', () => {
    it('should publish a course module', async () => {
      const courseId = 'course-id';
      const id = 'module-id';

      const publishedCourseModule = { ...mockCourseModule, isPublished: true };
      service.publish.mockResolvedValue(publishedCourseModule as any);

      const result = await controller.publish(courseId, id);

      expect(service.publish).toHaveBeenCalledWith(courseId, id);
      expect(result).toBe(publishedCourseModule);
    });
  });

  describe('delete', () => {
    it('should delete a course module', async () => {
      const courseId = 'course-id';
      const id = 'module-id';

      service.delete.mockResolvedValue(undefined);

      await controller.delete(courseId, id);

      expect(service.delete).toHaveBeenCalledWith(courseId, id);
    });
  });
});
