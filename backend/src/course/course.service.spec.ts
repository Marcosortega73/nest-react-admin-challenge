import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { CourseService } from './course.service';
import { Course } from './course.entity';
import { CourseModule } from '../course-modules/course-module.entity';
import { CourseLesson, LessonType } from '../course-lessons/course-lesson.entity';
import { CourseResource, ResourceType } from '../course-resources/course-resource.entity';

// Mock para QueryRunner
const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    save: jest.fn(),
    find: jest.fn(),
  },
};

// Mock para DataSource
const mockDataSource = {
  createQueryRunner: jest.fn(() => mockQueryRunner),
};

const MockService = {
  save: jest.fn().mockImplementation((createCourseDto: CreateCourseDto) => {
    return {
      id: 'testid',
      dateCreated: new Date(),
      ...createCourseDto,
    };
  }),
  findAll: jest.fn().mockImplementation(() => {
    return [
      {
        id: 'testid1',
        name: 'test1',
        description: 'test1',
        dateCreated: new Date(),
      },
      {
        id: 'testid2',
        name: 'test2',
        description: 'test2',
        dateCreated: new Date(),
      },
      {
        id: 'testid3',
        name: 'test3',
        description: 'test3',
        dateCreated: new Date(),
      },
    ];
  }),
  findById: jest.fn().mockImplementation((id: string) => {
    return {
      id,
      name: 'test',
      description: 'test',
      dateCreated: new Date(),
    };
  }),
  update: jest
    .fn()
    .mockImplementation((id: string, updateCourseDto: UpdateCourseDto) => {
      return {
        id,
        ...updateCourseDto,
      };
    }),
  delete: jest.fn().mockImplementation((id) => id),
  count: jest.fn().mockReturnValue(10),
};

describe('CourseService', () => {
  let service: CourseService;
  let dataSource: DataSource;

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock static methods of Course entity
    jest.spyOn(Course, 'find').mockResolvedValue([
      {
        id: 'testid1',
        name: 'test1',
        description: 'test1',
        dateCreated: new Date(),
      },
      {
        id: 'testid2',
        name: 'test2',
        description: 'test2',
        dateCreated: new Date(),
      },
      {
        id: 'testid3',
        name: 'test3',
        description: 'test3',
        dateCreated: new Date(),
      },
    ] as any);

    jest.spyOn(Course, 'findOne').mockResolvedValue({
      id: 'testid',
      name: 'test',
      description: 'test',
      dateCreated: new Date(),
    } as any);

    jest.spyOn(Course, 'create').mockImplementation((data: any) => ({
      save: jest.fn().mockResolvedValue({
        ...data,
        dateCreated: new Date(),
      }),
    } as any));

    jest.spyOn(Course, 'delete').mockResolvedValue({} as any);
    jest.spyOn(Course, 'count').mockResolvedValue(10);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveCourse', () => {
    beforeEach(() => {
      // Mock findById para el retorno final
      jest.spyOn(service, 'findById').mockResolvedValue({
        id: 'course-id',
        name: 'Test Course',
        description: 'Test Description',
        dateCreated: new Date(),
      } as any);
    });

    it('should create a course with basic data only', async () => {
      const createCourseDto: CreateCourseDto = {
        name: 'Test Course',
        description: 'Test Description',
      };

      mockQueryRunner.manager.save.mockResolvedValueOnce({
        id: 'course-id',
        name: 'Test Course',
        description: 'Test Description',
        dateCreated: new Date(),
      });

      const result = await service.save(createCourseDto);

      expect(mockDataSource.createQueryRunner).toHaveBeenCalled();
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(Course, {
        name: 'Test Course',
        description: 'Test Description',
        imageUrl: undefined,
        isPublished: false,
        dateCreated: expect.any(Date),
      });
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(result.id).toBe('course-id');
    });

    it('should create a course with modules, resources, and lessons', async () => {
      const createCourseDto: CreateCourseDto = {
        name: 'Complete Course',
        description: 'Complete Description',
        imageUrl: 'https://example.com/image.jpg',
        isPublished: true,
        modules: [
          {
            title: 'Module 1',
            description: 'Module 1 Description',
            isPublished: true,
          },
          {
            title: 'Module 2',
            isPublished: false,
          },
        ],
        resources: [
          {
            name: 'PDF Resource',
            type: 'pdf',
            url: 'https://example.com/resource.pdf',
            isPublished: true,
          },
          {
            name: 'URL Resource',
            type: 'url',
            url: 'https://example.com/link',
            isPublished: false,
          },
        ],
        lessons: [
          {
            title: 'Lesson 1',
            content: 'https://example.com/lesson1',
            moduleIndex: 0,
            isPublished: true,
          },
          {
            title: 'Lesson 2',
            content: 'https://example.com/lesson2',
            moduleIndex: 1,
            isPublished: false,
          },
        ],
      };

      // Mock course creation
      mockQueryRunner.manager.save
        .mockResolvedValueOnce({
          id: 'course-id',
          name: 'Complete Course',
        })
        // Mock modules creation
        .mockResolvedValueOnce({ id: 'module-1-id' })
        .mockResolvedValueOnce({ id: 'module-2-id' })
        // Mock resources creation
        .mockResolvedValueOnce({ id: 'resource-1-id' })
        .mockResolvedValueOnce({ id: 'resource-2-id' })
        // Mock lessons creation
        .mockResolvedValueOnce({ id: 'lesson-1-id' })
        .mockResolvedValueOnce({ id: 'lesson-2-id' });

      // Mock modules query for lessons
      mockQueryRunner.manager.find.mockResolvedValueOnce([
        { id: 'module-1-id', position: 1 },
        { id: 'module-2-id', position: 2 },
      ]);

      const result = await service.save(createCourseDto);

      // Verify course creation
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(Course, {
        name: 'Complete Course',
        description: 'Complete Description',
        imageUrl: 'https://example.com/image.jpg',
        isPublished: true,
        dateCreated: expect.any(Date),
      });

      // Verify modules creation
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(CourseModule, 
        expect.objectContaining({
          title: 'Module 1',
          description: 'Module 1 Description',
          position: 1,
          isPublished: true,
          courseId: 'course-id',
        })
      );

      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(CourseModule, 
        expect.objectContaining({
          title: 'Module 2',
          description: undefined,
          position: 2,
          isPublished: false,
          courseId: 'course-id',
        })
      );

      // Verify that save was called the expected number of times
      // 1 Course + 2 Modules + 2 Resources + 2 Lessons = 7 calls
      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(7);

      // Verify transaction flow
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();

      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(result.id).toBe('course-id');
    });

    it('should throw BadRequestException when lessons exist without modules', async () => {
      const createCourseDto: CreateCourseDto = {
        name: 'Invalid Course',
        lessons: [
          {
            title: 'Lesson without module',
            content: 'https://example.com/lesson',
            moduleIndex: 0,
          },
        ],
      };

      mockQueryRunner.manager.save.mockResolvedValueOnce({
        id: 'course-id',
        name: 'Invalid Course',
      });

      await expect(service.save(createCourseDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.save(createCourseDto)).rejects.toThrow(
        'No se pueden crear lecciones sin módulos',
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should rollback transaction on error', async () => {
      const createCourseDto: CreateCourseDto = {
        name: 'Test Course',
        description: 'Test Description',
      };

      mockQueryRunner.manager.save.mockRejectedValueOnce(
        new Error('Database error'),
      );

      await expect(service.save(createCourseDto)).rejects.toThrow(
        'Database error',
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should map resource types correctly', async () => {
      const createCourseDto: CreateCourseDto = {
        name: 'Resource Test Course',
        resources: [
          { name: 'PDF', type: 'pdf', url: 'test.pdf' },
          { name: 'URL', type: 'url', url: 'test.com' },
          { name: 'ZIP', type: 'zip', url: 'test.zip' },
        ],
      };

      mockQueryRunner.manager.save.mockResolvedValueOnce({
        id: 'course-id',
        name: 'Resource Test Course',
      });

      await service.save(createCourseDto);

      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        CourseResource,
        expect.objectContaining({ type: ResourceType.PDF }),
      );
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        CourseResource,
        expect.objectContaining({ type: ResourceType.LINK }),
      );
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        CourseResource,
        expect.objectContaining({ type: ResourceType.DOCUMENT }),
      );
    });
  });

  describe('findAllCourses', () => {
    it('should get the array of courses ', async () => {
      const courses = await service.findAll({});
      expect(courses[0].id).toBe('testid1');
      expect(courses[1].name).toBe('test2');
      expect(courses[2].description).toBe('test3');
    });
  });

  describe('findCourseById', () => {
    it('should get the course with matching id ', async () => {
      const course = await service.findById('testid');

      expect(course).toEqual(
        expect.objectContaining({
          id: 'testid',
          name: 'test',
          description: 'test',
          dateCreated: expect.any(Date),
        })
      );
    });
  });

  describe('updateCourse', () => {
    it('should update a course and return changed values', async () => {
      const updatedCourse = await service.update('testid', {
        name: 'updated name',
        description: 'updated description',
      });

      expect(updatedCourse).toEqual(
        expect.objectContaining({
          id: 'testid',
          name: 'updated name',
          description: 'updated description',
        })
      );

      const updatedCourse2 = await service.update('testid', {
        name: 'another update',
      });

      expect(updatedCourse2).toEqual(
        expect.objectContaining({
          id: 'testid',
          name: 'another update',
        })
      );
    });
  });

  describe('deleteCourse', () => {
    it('should delete a course and return the id', async () => {
      const id = await service.delete('testid');
      expect(id).toBe('testid');
    });
  });

  describe('count', () => {
    it('should get number of courses', async () => {
      const count = await service.count();
      expect(count).toBe(10);
    });
  });
});
