import { Test, TestingModule } from '@nestjs/testing';

import { CreateEnrollmentDto } from './dto/create-enrollment.dto.ts';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { EnrollmentSource, EnrollmentStatus } from './enrollments.entity';
import { EnrollmentService } from './enrollments.service';

describe('EnrollmentService', () => {
  let service: EnrollmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EnrollmentService,
          useValue: {
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
            save: jest
              .fn()
              .mockImplementation(
                (createEnrollmentDto: CreateEnrollmentDto) => {
                  return {
                    id: 'testid',
                    ...createEnrollmentDto,
                  };
                },
              ),
            findOne: jest.fn().mockImplementation((id: string) => {
              return {
                id,
                userId: 'test',
                courseId: 'test',
                status: EnrollmentStatus.ACTIVE,
                source: EnrollmentSource.SELF,
              };
            }),
            findByUserId: jest.fn().mockImplementation((userId: string) => {
              return {
                id: 'testid',
                userId: userId,
                courseId: 'test',
                status: EnrollmentStatus.ACTIVE,
                source: EnrollmentSource.SELF,
              };
            }),
            update: jest
              .fn()
              .mockImplementation(
                (id: string, updateEnrollmentDto: UpdateEnrollmentDto) => {
                  return {
                    id,
                    ...updateEnrollmentDto,
                  };
                },
              ),
            delete: jest.fn().mockImplementation((id: string) => id),
            count: jest.fn().mockReturnValue(10),
          },
        },
      ],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('save', () => {
    it('should get the same enrollment that is created', async () => {
      const returnValue = await service.save({
        userId: 'test1',
        courseId: 'test1',
        status: EnrollmentStatus.ACTIVE,
        source: EnrollmentSource.SELF,
      });
      expect(returnValue.id).toBe('testid');
      expect(returnValue.userId).toBe('test1');
      expect(returnValue.status).toBe(EnrollmentStatus.ACTIVE);
    });
  });

  describe('findAll', () => {
    it('should get the list of enrollments', async () => {
      const enrollments = await service.findAll();
      expect(typeof enrollments).toBe('object');
      expect(enrollments[0].userId).toBe('test1');
      expect(enrollments[1].status).toBe(EnrollmentStatus.COMPLETED);
      expect(enrollments[2].source).toBe(EnrollmentSource.SELF);
      expect(enrollments.length).toBe(3);
    });
  });

  describe('delete', () => {
    it('should delete an enrollment and return the id', async () => {
      const id = await service.delete('test1');
      expect(id).toBe('test1');
    });
  });
});
