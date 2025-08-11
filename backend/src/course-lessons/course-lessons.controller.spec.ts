import { Test, TestingModule } from '@nestjs/testing';

import {
  CreateCourseLessonDto,
  FindCourseLessonsDto,
  ReorderCourseLessonsDto,
  UpdateCourseLessonDto,
} from './course-lesson.dto';
import { CourseLesson, LessonType } from './course-lesson.entity';
import { CourseLessonsController } from './course-lessons.controller';
import {
  CourseLessonsService,
  PaginatedResult,
} from './course-lessons.service';

describe('CourseLessonsController', () => {
  let controller: CourseLessonsController;
  let service: jest.Mocked<CourseLessonsService>;

  const mockCourseLesson: CourseLesson = {
    id: 'test-id',
    title: 'Test Lesson',
    subtitle: 'Test Subtitle',
    position: 1,
    type: LessonType.VIDEO,
    contentUrl: 'https://example.com/video.mp4',
    html: null,
    durationSec: 300,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    moduleId: 'module-id',
    module: null,
    save: jest.fn(),
    remove: jest.fn(),
    softRemove: jest.fn(),
    recover: jest.fn(),
    reload: jest.fn(),
    hasId: jest.fn(),
  };

  const mockPaginatedResult: PaginatedResult<CourseLesson> = {
    data: [mockCourseLesson],
    meta: { page: 1, limit: 20, total: 1 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseLessonsController],
      providers: [
        {
          provide: CourseLessonsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            reorder: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CourseLessonsController>(CourseLessonsController);
    service = module.get(CourseLessonsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new course lesson', async () => {
      const moduleId = 'module-id';
      const createDto: CreateCourseLessonDto = {
        title: 'New Lesson',
        type: LessonType.VIDEO,
        contentUrl: 'https://example.com/video.mp4',
        durationSec: 300,
      };

      service.create.mockResolvedValue(mockCourseLesson);

      const result = await controller.create(moduleId, createDto);

      expect(service.create).toHaveBeenCalledWith(moduleId, createDto);
      expect(result).toBe(mockCourseLesson);
    });
  });

  describe('findAll', () => {
    it('should return paginated course lessons', async () => {
      const moduleId = 'module-id';
      const query: FindCourseLessonsDto = { page: 1, limit: 20 };

      service.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.findAll(moduleId, query);

      expect(service.findAll).toHaveBeenCalledWith(moduleId, query);
      expect(result).toBe(mockPaginatedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single course lesson', async () => {
      const moduleId = 'module-id';
      const id = 'lesson-id';

      service.findOne.mockResolvedValue(mockCourseLesson);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toBe(mockCourseLesson);
    });
  });

  describe('update', () => {
    it('should update a course lesson', async () => {
      const moduleId = 'module-id';
      const id = 'lesson-id';
      const updateDto: UpdateCourseLessonDto = {
        title: 'Updated Lesson',
        durationSec: 600,
        moduleIndex: 1,
        isPublished: true,
        position: 1,
      };

      const updatedCourseLesson = { ...mockCourseLesson, ...updateDto };
      service.update.mockResolvedValue(updatedCourseLesson as any);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toBe(updatedCourseLesson);
    });
  });

  describe('reorder', () => {
    it('should reorder course lessons', async () => {
      const moduleId = 'module-id';
      const reorderDto: ReorderCourseLessonsDto = {
        items: [
          { id: 'lesson-1', position: 2 },
          { id: 'lesson-2', position: 1 },
        ],
      };

      const reorderedCourseLessons = [mockCourseLesson];
      service.reorder.mockResolvedValue(reorderedCourseLessons);

      const result = await controller.reorder(moduleId, reorderDto);

      expect(service.reorder).toHaveBeenCalledWith(moduleId, reorderDto);
      expect(result).toBe(reorderedCourseLessons);
    });
  });

  describe('delete', () => {
    it('should delete a course lesson', async () => {
      const id = 'lesson-id';

      service.delete.mockResolvedValue(undefined);

      await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
