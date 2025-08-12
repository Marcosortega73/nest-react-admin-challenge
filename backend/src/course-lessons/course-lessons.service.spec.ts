import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import {
  CreateCourseLessonDto,
  FindCourseLessonsDto,
  ReorderCourseLessonsDto,
  UpdateCourseLessonDto,
} from './course-lesson.dto';
import { CourseLesson, LessonType } from './course-lesson.entity';
import { CourseLessonsService } from './course-lessons.service';

describe('CourseLessonsService', () => {
  let service: CourseLessonsService;
  let repository: jest.Mocked<Repository<CourseLesson>>;

  const mockCourseLesson: CourseLesson = {
    id: 'test-id',
    title: 'Test Lesson',
    subtitle: 'Test Subtitle',
    position: 1,
    type: LessonType.VIDEO,
    contentUrl: 'https://example.com/video.mp4',
    html: null,
    durationSec: 300,
    isPublished: false,
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseLessonsService,
        {
          provide: getRepositoryToken(CourseLesson),
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

    service = module.get<CourseLessonsService>(CourseLessonsService);
    repository = module.get(getRepositoryToken(CourseLesson));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create VIDEO lesson with contentUrl', async () => {
      const moduleId = 'module-id';
      const createDto: CreateCourseLessonDto = {
        title: 'Video Lesson',
        type: LessonType.VIDEO,
        contentUrl: 'https://example.com/video.mp4',
        durationSec: 300,
        moduleId,
      };

      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ maxPosition: 2 }),
      };

      repository.createQueryBuilder.mockReturnValue(queryBuilder as any);
      repository.create.mockReturnValue({
        ...mockCourseLesson,
        position: 3,
      } as any);
      repository.save.mockResolvedValue({
        ...mockCourseLesson,
        position: 3,
      } as any);

      const result = await service.create(moduleId, createDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        moduleId,
        position: 3,
      });
      expect(result.position).toBe(3);
    });

    it('should create TEXT lesson with html content', async () => {
      const moduleId = 'module-id';
      const createDto: CreateCourseLessonDto = {
        title: 'Text Lesson',
        type: LessonType.TEXT,
        html: '<p>Lesson content</p>',
        moduleId,
      };

      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ maxPosition: 0 }),
      };

      repository.createQueryBuilder.mockReturnValue(queryBuilder as any);
      repository.create.mockReturnValue({
        ...mockCourseLesson,
        type: LessonType.TEXT,
        html: '<p>Lesson content</p>',
        position: 1,
      } as any);
      repository.save.mockResolvedValue({
        ...mockCourseLesson,
        type: LessonType.TEXT,
        html: '<p>Lesson content</p>',
        position: 1,
      } as any);

      const result = await service.create(moduleId, createDto);

      expect(result.type).toBe(LessonType.TEXT);
      expect(result.html).toBe('<p>Lesson content</p>');
    });

    it('should throw BadRequestException when TEXT lesson has no html', async () => {
      const moduleId = 'module-id';
      const createDto: CreateCourseLessonDto = {
        title: 'Invalid Text Lesson',
        type: LessonType.TEXT,
        moduleId,
        // html is missing
      };

      await expect(service.create(moduleId, createDto)).rejects.toThrow(
        new BadRequestException(
          'HTML content is required for TEXT type lessons',
        ),
      );
    });

    it('should throw BadRequestException when VIDEO lesson has no contentUrl', async () => {
      const moduleId = 'module-id';
      const createDto: CreateCourseLessonDto = {
        title: 'Invalid Video Lesson',
        type: LessonType.VIDEO,
        moduleId,
        // contentUrl is missing
      };

      await expect(service.create(moduleId, createDto)).rejects.toThrow(
        new BadRequestException(
          'Content URL is required for non-TEXT type lessons',
        ),
      );
    });

    it('should throw BadRequestException on unique constraint violation', async () => {
      const moduleId = 'module-id';
      const createDto: CreateCourseLessonDto = {
        title: 'New Lesson',
        type: LessonType.VIDEO,
        contentUrl: 'https://example.com/video.mp4',
        position: 1,
        moduleId,
      };

      const uniqueError = new QueryFailedError('query', [], {
        code: '23505',
        detail: 'Key (moduleId, position)=(module-id, 1) already exists.',
      } as any);

      repository.create.mockReturnValue(mockCourseLesson as any);
      repository.save.mockRejectedValue(uniqueError);

      await expect(service.create(moduleId, createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated course lessons ordered by position', async () => {
      const moduleId = 'module-id';
      const query: FindCourseLessonsDto = { page: 1, limit: 10 };
      const courseLessons = [mockCourseLesson];

      repository.findAndCount.mockResolvedValue([courseLessons, 1]);

      const result = await service.findAll(moduleId, query);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { moduleId },
        order: { position: 'ASC' },
        skip: 0,
        take: 10,
      });

      expect(result).toEqual({
        data: courseLessons,
        meta: { page: 1, limit: 10, total: 1 },
      });
    });
  });

  describe('findOne', () => {
    it('should return course lesson when found', async () => {
      const id = 'lesson-id';

      repository.findOne.mockResolvedValue(mockCourseLesson);

      const result = await service.findOne(id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toBe(mockCourseLesson);
    }); 

    it('should throw NotFoundException when course lesson not found', async () => {
      const id = 'non-existent-id';

      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update course lesson with valid content', async () => {
      const id = 'lesson-id';
      const updateDto: UpdateCourseLessonDto = {
        title: 'Updated Lesson',
        contentUrl: 'https://example.com/updated-video.mp4',
        moduleIndex: 1,
        isPublished: true,
        position: 1,
      };

      repository.findOne.mockResolvedValue(mockCourseLesson);
      repository.save.mockResolvedValue({
        ...mockCourseLesson,
        ...updateDto,
      } as any);

      const result = await service.update(id, updateDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...mockCourseLesson,
        ...updateDto,
      });
      expect(result.title).toBe('Updated Lesson');
    });

    it('should validate content when updating lesson type', async () => {
      const id = 'lesson-id';
      const updateDto: UpdateCourseLessonDto = {
        type: LessonType.TEXT,
        title: 'Updated Lesson',
        position: 1,
        moduleIndex: 1,
        isPublished: false,
        html: '', // Empty HTML should trigger validation error
      };

      repository.findOne.mockResolvedValue(mockCourseLesson);

      await expect(service.update(id, updateDto)).rejects.toThrow(
        new BadRequestException(
          'HTML content is required for TEXT type lessons',
        ),
      );
    });
  });

  describe('delete', () => {
    it('should hard delete course lesson', async () => {
      const id = 'lesson-id';

      repository.findOne.mockResolvedValue(mockCourseLesson);
      repository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.delete(id);

      expect(repository.delete).toHaveBeenCalledWith(mockCourseLesson.id);
    });
  });
});
