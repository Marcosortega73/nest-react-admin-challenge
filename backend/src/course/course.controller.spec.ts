import { Test, TestingModule } from '@nestjs/testing';

import { CourseController } from './course.controller';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { CourseService } from './course.service';

const CourseMockService = {
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
};

describe('CourseController', () => {
  let controller: CourseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        {
          provide: CourseService,
          useValue: CourseMockService,
        },
      ],
    }).compile();

    controller = module.get<CourseController>(CourseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('saveCourse', () => {
    it('should get the created course ', async () => {
      const created = await controller.save({
        name: 'test',
        description: 'test',
      });
      expect(created.id).toBe('testid');
      expect(created.name).toBe('test');
      expect(created.description).toBe('test');
    });
  });

  describe('findAllCourses', () => {
    it('should get the array of courses ', async () => {
      const mockUser = { userId: 'test-user-id', role: 'Admin' };
      const courses = await controller.findAll({}, mockUser as any);
      expect(courses[0].id).toBe('testid1');
      expect(courses[1].name).toBe('test2');
      expect(courses[2].description).toBe('test3');
    });
  });

  describe('findCourseById', () => {
    it('should get the course with matching id ', async () => {
      const spy = jest.spyOn(global, 'Date');
      const course = await controller.findOne('testid');
      const date = spy.mock.instances[0];

      expect(course).toEqual({
        id: 'testid',
        name: 'test',
        description: 'test',
        dateCreated: date,
      });
    });
  });

  describe('updateCourse', () => {
    it('should update a course and return changed values', async () => {
      const updatedCourse = await controller.update('testid', {
        name: 'test',
        description: 'test',
      });

      expect(updatedCourse).toEqual({
        id: 'testid',
        name: 'test',
        description: 'test',
      });

      const updatedCourse2 = await controller.update('testid2', {
        name: 'test2',
      });

      expect(updatedCourse2).toEqual({
        id: 'testid2',
        name: 'test2',
      });
    });
  });

  describe('deleteCourse', () => {
    it('should delete a course and return the id', async () => {
      const id = await controller.delete('testid');
      expect(id).toBe('testid');
    });
  });
});
