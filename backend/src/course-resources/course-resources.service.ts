import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import {
  getUniqueViolationMessage,
  isUniqueViolation,
} from '../utils/database-error.util';
import {
  CreateCourseResourceDto,
  FindCourseResourcesDto,
  UpdateCourseResourceDto,
} from './course-resource.dto';
import { CourseResource } from './course-resource.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class CourseResourcesService {
  constructor(
    @InjectRepository(CourseResource)
    private readonly courseResourceRepository: Repository<CourseResource>,
  ) {}

  async create(
    courseId: string,
    createCourseResourceDto: CreateCourseResourceDto,
  ): Promise<CourseResource> {
    try {
      const courseResource = this.courseResourceRepository.create({
        ...createCourseResourceDto,
        courseId,
        downloadCount: 0,
        isActive: createCourseResourceDto.isActive ?? true,
      });

      return await this.courseResourceRepository.save(courseResource);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new BadRequestException(getUniqueViolationMessage(error));
      }
      throw error;
    }
  }

  async findAll(
    courseId: string,
    findCourseResourcesDto: FindCourseResourcesDto,
  ): Promise<PaginatedResult<CourseResource>> {
    const { page = 1, limit = 10, ...filters } = findCourseResourcesDto;
    const skip = (page - 1) * limit;

    const where: any = { courseId };

    if (filters.title) {
      where.title = ILike(`%${filters.title}%`);
    }

    if (filters.description) {
      where.description = ILike(`%${filters.description}%`);
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const [data, total] = await this.courseResourceRepository.findAndCount({
      where,
      order: {
        createdAt: 'DESC',
        title: 'ASC',
      },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(courseId: string, id: string): Promise<CourseResource> {
    const courseResource = await this.courseResourceRepository.findOne({
      where: { id, courseId },
    });

    if (!courseResource) {
      throw new NotFoundException(
        `Course resource with ID ${id} not found in course ${courseId}`,
      );
    }

    return courseResource;
  }

  async update(
    courseId: string,
    id: string,
    updateCourseResourceDto: UpdateCourseResourceDto,
  ): Promise<CourseResource> {
    const courseResource = await this.findOne(courseId, id);

    try {
      Object.assign(courseResource, updateCourseResourceDto);
      return await this.courseResourceRepository.save(courseResource);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new BadRequestException(getUniqueViolationMessage(error));
      }
      throw error;
    }
  }

  async remove(courseId: string, id: string): Promise<void> {
    const courseResource = await this.findOne(courseId, id);
    await this.courseResourceRepository.remove(courseResource);
  }

  async incrementDownloadCount(courseId: string, id: string): Promise<void> {
    const courseResource = await this.findOne(courseId, id);
    courseResource.downloadCount += 1;
    await this.courseResourceRepository.save(courseResource);
  }

  async toggleActive(courseId: string, id: string): Promise<CourseResource> {
    const courseResource = await this.findOne(courseId, id);
    courseResource.isActive = !courseResource.isActive;
    return await this.courseResourceRepository.save(courseResource);
  }

  async getResourcesByType(
    courseId: string,
    type: string,
  ): Promise<CourseResource[]> {
    return await this.courseResourceRepository.find({
      where: { courseId, type: type as any, isActive: true },
      order: { title: 'ASC' },
    });
  }
}
