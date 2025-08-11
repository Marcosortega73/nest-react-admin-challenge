import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { getUniqueViolationMessage, isUniqueViolation } from '../utils/database-error.util';
import {
  CreateCourseModuleDto,
  FindCourseModulesDto,
  ReorderCourseModulesDto,
  UpdateCourseModuleDto,
} from './course-module.dto';
import { CourseModule } from './course-module.entity';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

@Injectable()
export class CourseModulesService {
  constructor(
    @InjectRepository(CourseModule)
    private readonly courseModuleRepository: Repository<CourseModule>,
  ) {}

  async create(courseId: string, createCourseModuleDto: CreateCourseModuleDto): Promise<CourseModule> {
    try {
      const position = createCourseModuleDto.position ?? (await this.getNextPosition(courseId));

      const courseModule = this.courseModuleRepository.create({
        ...createCourseModuleDto,
        courseId,
        position,
      });

      return await this.courseModuleRepository.save(courseModule);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new BadRequestException(getUniqueViolationMessage(error));
      }
      throw error;
    }
  }

  async findAll(courseId: string, query: FindCourseModulesDto): Promise<PaginatedResult<CourseModule>> {
    const { page = 1, limit = 20, q } = query;
    const skip = (page - 1) * limit;

    const whereCondition: any = {
      courseId,
      isDeleted: false,
    };

    if (q) {
      whereCondition.title = ILike(`%${q}%`);
    }

    const [data, total] = await this.courseModuleRepository.findAndCount({
      where: whereCondition,
      order: { position: 'ASC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: { page, limit, total },
    };
  }

  async findOne(id: string): Promise<CourseModule> {
    const courseModule = await this.courseModuleRepository.findOne({
      where: { id },
    });

    if (!courseModule) {
      throw new NotFoundException('Course module not found');
    }

    return courseModule;
  }

  async update(id: string, updateCourseModuleDto: UpdateCourseModuleDto): Promise<CourseModule> {
    const courseModule = await this.findOne(id);

    try {
      Object.assign(courseModule, updateCourseModuleDto);
      return await this.courseModuleRepository.save(courseModule);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new BadRequestException(getUniqueViolationMessage(error));
      }
      throw error;
    }
  }

  async reorder(courseId: string, reorderDto: ReorderCourseModulesDto): Promise<CourseModule[]> {
    const { items } = reorderDto;
    const moduleIds = items.map(item => item.id);

    const courseModules = await this.courseModuleRepository.find({
      where: {
        id: In(moduleIds),
        courseId,
        isDeleted: false,
      },
    });

    if (courseModules.length !== items.length) {
      throw new BadRequestException('Some course modules not found');
    }

    try {
      for (const item of items) {
        const courseModule = courseModules.find(m => m.id === item.id);
        if (courseModule) {
          courseModule.position = item.position;
        }
      }

      await this.courseModuleRepository.save(courseModules);

      return await this.courseModuleRepository.find({
        where: { courseId, isDeleted: false },
        order: { position: 'ASC' },
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new BadRequestException(getUniqueViolationMessage(error));
      }
      throw error;
    }
  }

  async publish(id: string): Promise<CourseModule> {
    const courseModule = await this.findOne(id);
    courseModule.isPublished = true;
    return await this.courseModuleRepository.save(courseModule);
  }

  async unpublish(id: string): Promise<CourseModule> {
    const courseModule = await this.findOne(id);
    courseModule.isPublished = false;
    return await this.courseModuleRepository.save(courseModule);
  }

  async delete(id: string): Promise<void> {
    const courseModule = await this.findOne(id);
    await this.courseModuleRepository.remove(courseModule);
  }

  private async getNextPosition(courseId: string): Promise<number> {
    // Get all positions (including deleted modules) to avoid conflicts
    const result = await this.courseModuleRepository
      .createQueryBuilder('courseModule')
      .select('MAX(courseModule.position)', 'maxPosition')
      .where('courseModule.courseId = :courseId', { courseId })
      .getRawOne();

    return (result?.maxPosition || 0) + 1;
  }
}
