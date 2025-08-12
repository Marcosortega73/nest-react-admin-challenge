import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

import { CourseModule } from '../course-modules/course-module.entity';
import { CourseLesson, LessonType } from '../course-lessons/course-lesson.entity';
import { CourseResource, ResourceType } from '../course-resources/course-resource.entity';
import { Role } from '../enums/role.enum';
import { Course } from 'course/course.entity';
import { CourseService } from 'course/course.service';

type Mem = {
  course: any | null;
  modules: any[];
  lessons: any[];
  resources: any[];
};

const mem: Mem = { course: null, modules: [], lessons: [], resources: [] };

const makeTxnManager = (mem: Mem) => {
  const mgr = {
    create: (_E: any, data: any) => ({ ...data }),
    save: async (entityOrArr: any) => {
      const arr = Array.isArray(entityOrArr) ? entityOrArr : [entityOrArr];
      const saved = arr.map(item => {
        if ('name' in item && 'isPublished' in item && !('position' in item) && !('type' in item)) {
          const c = { ...item, id: 'course-id' };
          mem.course = c;
          return c;
        }
        if ('position' in item && 'course' in item && !('type' in item) && !('module' in item)) {
          const id = `m-${mem.modules.length + 1}`;
          const m = { ...item, id };
          mem.modules.push(m);
          return m;
        }
        if ('module' in item && 'position' in item) {
          const id = `l-${mem.lessons.length + 1}`;
          const l = { ...item, id };
          mem.lessons.push(l);
          return l;
        }
        if ('type' in item && 'url' in item && 'course' in item) {
          const id = `r-${mem.resources.length + 1}`;
          const r = { ...item, id };
          mem.resources.push(r);
          return r;
        }
        return { ...item, id: item?.id ?? 'x-1' };
      });
      return Array.isArray(entityOrArr) ? saved : saved[0];
    },
    find: async (Entity: any) => {
      if (Entity === CourseModule) return [...mem.modules].sort((a, b) => a.position - b.position);
      return [];
    },
    findOne: async (Entity: any) => {
      if (Entity === Course) {
        if (!mem.course) return null;
        return {
          ...mem.course,
          modules: mem.modules.map(m => ({
            ...m,
            lessons: mem.lessons.filter(l => l.module?.id === m.id),
          })),
          resources: [...mem.resources],
        };
      }
      return null;
    },
    findOneOrFail: async (Entity: any, opts?: any) => {
      const found = await mgr.findOne(Entity);
      if (!found) throw new Error('not found');
      return found;
    },
    delete: async (Entity: any) => {
      if (Entity === CourseModule) {
        mem.modules = [];
        mem.lessons = [];
      } else if (Entity === CourseLesson) {
        mem.lessons = [];
      } else if (Entity === CourseResource) {
        mem.resources = [];
      }
      return { affected: 1 };
    },
  };
  return mgr;
};

const mockQueryBuilder = () => {
  const self: any = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([
      {
        id: 'c1',
        name: 'Course c1',
        description: 'Desc c1',
        isPublished: true,
        modules: [{ id: 'c1-m1', position: 1, lessons: [{ id: 'c1-l1', position: 1 }] }],
        resources: [],
      },
      {
        id: 'c2',
        name: 'Course c2',
        description: 'Desc c2',
        isPublished: true,
        modules: [{ id: 'c2-m1', position: 1, lessons: [{ id: 'c2-l1', position: 1 }] }],
        resources: [],
      },
      { id: 'c3', name: 'Course c3', description: 'Desc c3', isPublished: false, modules: [], resources: [] },
    ]),
  };
  return self;
};

describe('CourseService', () => {
  let service: CourseService;

  const mockDataSource: Partial<DataSource> = {
    transaction: jest.fn().mockImplementation(async cb => {
      const mgr = makeTxnManager(mem);
      return cb(mgr as any);
    }),
  };

  beforeEach(async () => {
    mem.course = null;
    mem.modules = [];
    mem.lessons = [];
    mem.resources = [];
    jest.clearAllMocks();
    jest.restoreAllMocks();

    jest.spyOn(Course as any, 'createQueryBuilder').mockImplementation(() => mockQueryBuilder());
    jest.spyOn(Course, 'findOne').mockImplementation(
      async (opts: any) =>
        ({
          id: opts?.where?.id ?? 'testid',
          name: 'Test Course',
          description: 'Test Description',
          modules: [],
          resources: [],
          enrollments: [],
          dateCreated: new Date(),
        } as any),
    );
    jest.spyOn(Course, 'remove').mockResolvedValue({} as any);
    jest.spyOn(Course, 'delete').mockResolvedValue({} as any);
    jest.spyOn(Course, 'count').mockResolvedValue(10);

    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseService, { provide: DataSource, useValue: mockDataSource }],
    }).compile();

    service = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveCourse', () => {
    it('should create a course with basic data only', async () => {
      const dto = { name: 'Test Course', description: 'Test Description' } as any;
      const result = await service.save(dto);
      expect(mockDataSource.transaction).toHaveBeenCalled();
      expect(result).toMatchObject({
        id: 'course-id',
        name: 'Test Course',
        description: 'Test Description',
        isPublished: false,
      });
      expect(result.modules?.length ?? 0).toBe(0);
      expect(result.resources?.length ?? 0).toBe(0);
    });

    it('should create a course with modules, resources, and lessons', async () => {
      const dto = {
        name: 'Complete Course',
        description: 'Complete Description',
        imageUrl: 'https://example.com/image.jpg',
        isPublished: true,
        modules: [
          { title: 'Module 1', description: 'Module 1 Description', isPublished: true },
          { title: 'Module 2', isPublished: false },
        ],
        resources: [
          { name: 'PDF Resource', type: 'pdf', url: 'https://example.com/resource.pdf', isPublished: true },
          { name: 'URL Resource', type: 'url', url: 'https://example.com/link', isPublished: false },
        ],
        lessons: [
          { title: 'Lesson 1', content: 'https://example.com/lesson1', moduleIndex: 0, isPublished: true },
          { title: 'Lesson 2', content: 'https://example.com/lesson2', moduleIndex: 1, isPublished: false },
        ],
      } as any;

      const result = await service.save(dto);

      expect(result).toMatchObject({
        id: 'course-id',
        name: 'Complete Course',
        description: 'Complete Description',
        imageUrl: 'https://example.com/image.jpg',
        isPublished: true,
      });
      expect(result.modules).toHaveLength(2);
      expect(result.modules[0]).toMatchObject({ title: 'Module 1', position: 1, isPublished: true });
      expect(result.modules[1]).toMatchObject({ title: 'Module 2', position: 2, isPublished: false });

      // lessons registradas
      expect(mem.lessons).toHaveLength(2);
      expect(mem.lessons[0]).toMatchObject({ title: 'Lesson 1', position: 1, type: LessonType.LINK });
      expect(mem.lessons[1]).toMatchObject({ title: 'Lesson 2', position: 1, type: LessonType.LINK });

      // recursos + mapeo tipos
      expect(result.resources).toHaveLength(2);
      const types = result.resources.map((r: any) => r.type);
      expect(types).toEqual(expect.arrayContaining([ResourceType.PDF, ResourceType.LINK]));
    });

    it('should throw BadRequestException when lessons exist without modules', async () => {
      const dto = {
        name: 'Invalid Course',
        lessons: [{ title: 'Lesson without module', content: 'https://example.com/lesson', moduleIndex: 0 }],
      } as any;

      await expect(service.save(dto)).rejects.toThrow(BadRequestException);
    });

    it('should map resource types correctly', async () => {
      const dto = {
        name: 'Resource Test Course',
        resources: [
          { name: 'PDF', type: 'pdf', url: 'test.pdf' },
          { name: 'URL', type: 'url', url: 'test.com' },
          { name: 'ZIP', type: 'zip', url: 'test.zip' },
          { name: 'Other', type: 'whatever', url: 'x' },
        ],
      } as any;

      const res = await service.save(dto);
      const types = res.resources.map((r: any) => r.type);
      expect(types).toEqual(
        expect.arrayContaining([ResourceType.PDF, ResourceType.LINK, ResourceType.DOCUMENT, ResourceType.OTHER]),
      );
    });
  });

  describe('findAllCourses', () => {
    it('should get the array of courses ', async () => {
      const courses = await service.findAll({ filter: 'all' } as any, Role.Admin, undefined);
      expect(courses).toHaveLength(3);
    });
  });

  describe('findCourseById', () => {
    it('should get the course with matching id ', async () => {
      const c = await service.findById('testid');
      expect(c).toEqual(
        expect.objectContaining({
          id: 'testid',
          name: 'Test Course',
          description: 'Test Description',
          dateCreated: expect.any(Date),
        }),
      );
    });
  });

  describe('updateCourse', () => {
    it('should update a course and return changed values', async () => {
      // Semilla
      await service.save({ name: 'Old', description: 'Old' } as any);

      const updated = await service.update('course-id', {
        name: 'updated name',
        description: 'updated description',
      } as any);

      expect(updated).toEqual(
        expect.objectContaining({
          id: 'course-id',
          name: 'updated name',
          description: 'updated description',
        }),
      );

      const updated2 = await service.update('course-id', { name: 'another update' } as any);
      expect(updated2).toEqual(expect.objectContaining({ id: 'course-id', name: 'another update' }));
    });
  });

  describe('deleteCourse', () => {
    it('should delete a course and return success message', async () => {
      const msg = await service.delete('testid');
      expect(msg).toBe('Course deleted successfully');
    });
  });

  describe('count', () => {
    it('should get number of courses', async () => {
      const count = await service.count();
      expect(count).toBe(10);
    });
  });
});
