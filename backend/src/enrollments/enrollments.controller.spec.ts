import { Test, TestingModule } from '@nestjs/testing';

import { CreateEnrollmentDto } from './dto/create-enrollment.dto.ts';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { EnrollmentController } from './enrollments.controller';
import { EnrollmentSource, EnrollmentStatus } from './enrollments.entity';
import { EnrollmentService } from './enrollments.service';

const MockService = {
  findAll: jest.fn().mockResolvedValue([
    {
      id: 'test1',
      userId: 'test1',
      courseId: 'test1',
      status: EnrollmentStatus.ACTIVE,
      source: EnrollmentSource.SELF,
    },
    {
      id: 'test2',
      userId: 'test2',
      courseId: 'test2',
      status: EnrollmentStatus.COMPLETED,
      source: EnrollmentSource.ADMIN,
    },
    {
      id: 'test3',
      userId: 'test3',
      courseId: 'test3',
      status: EnrollmentStatus.ACTIVE,
      source: EnrollmentSource.SELF,
    },
  ]),
  saveEnrollment: jest
    .fn()
    .mockImplementation((createEnrollmentDto: CreateEnrollmentDto) => {
      return {
        id: 'testid',
        ...createEnrollmentDto,
      };
    }),
  findOneEnrollment: jest.fn().mockImplementation((id) => {
    return {
      id,
      userId: 'testid',
      courseId: 'testid',
      status: EnrollmentStatus.ACTIVE,
      source: EnrollmentSource.SELF,
    };
  }),
  updateEnrollment: jest
    .fn()
    .mockImplementation(
      (id: string, updateEnrollmentDto: UpdateEnrollmentDto) => {
        return {
          id,
          ...updateEnrollmentDto,
        };
      },
    ),
  deleteEnrollment: jest.fn().mockImplementation((id: string) => id),
};

describe('EnrollmentController', () => {
  let controller: EnrollmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentController],
      providers: [
        {
          provide: EnrollmentService,
          useValue: MockService,
        },
      ],
    }).compile();

    controller = module.get<EnrollmentController>(EnrollmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('saveEnrollment', () => {
    it('should get the same user that is created', async () => {
      const returnValue = await controller.save({
        userId: 'testid',
        courseId: 'testid',
        source: EnrollmentSource.SELF,
        status: EnrollmentStatus.ACTIVE,
      });
      expect(returnValue.id).toBe('testid');
      expect(returnValue.userId).toBe('testid');
      expect(returnValue.status).toBe(EnrollmentStatus.ACTIVE);
    });
  });

  describe('findOneEnrollment', () => {
    it('should get a user matching id', async () => {
      const enrollment = await controller.findOne('testid');
      expect(enrollment.id).toBe('testid');
      expect(enrollment.userId).toBe('testid');
    });
  });

  describe('deleteEnrollment', () => {
    it('should delete a user and return the id', async () => {
      const id = await controller.delete('testid');
      expect(id).toBe('testid');
    });
  });
});
