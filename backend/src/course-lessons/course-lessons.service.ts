import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { getUniqueViolationMessage, isUniqueViolation } from '../utils/database-error.util';
import {
  CreateCourseLessonDto,
  FindCourseLessonsDto,
  ReorderCourseLessonsDto,
  UpdateCourseLessonDto,
} from './course-lesson.dto';
import { CourseLesson, LessonType } from './course-lesson.entity';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

@Injectable()
export class CourseLessonsService {
  constructor(
    @InjectRepository(CourseLesson)
    private readonly courseLessonRepository: Repository<CourseLesson>,
  ) {}

  async create(moduleId: string, createCourseLessonDto: CreateCourseLessonDto): Promise<CourseLesson> {
    this.validateLessonContent(createCourseLessonDto);

    try {
      const position = createCourseLessonDto.position ?? (await this.getNextPosition(moduleId));

      const courseLesson = this.courseLessonRepository.create({
        ...createCourseLessonDto,
        moduleId,
        position,
      });

      return await this.courseLessonRepository.save(courseLesson);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new BadRequestException(getUniqueViolationMessage(error));
      }
      throw error;
    }
  }

  async findAll(moduleId: string, query: FindCourseLessonsDto): Promise<PaginatedResult<CourseLesson>> {
    const { page = 1, limit = 20, q } = query;
    const skip = (page - 1) * limit;

    const whereCondition: any = { moduleId };

    if (q) {
      whereCondition.title = ILike(`%${q}%`);
    }

    const [data, total] = await this.courseLessonRepository.findAndCount({
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

  async findOne(id: string): Promise<CourseLesson> {
    const courseLesson = await this.courseLessonRepository.findOne({
      where: { id },
    });

    if (!courseLesson) {
      throw new NotFoundException('Course lesson not found');
    }

    return courseLesson;
  }

  async update(id: string, updateCourseLessonDto: UpdateCourseLessonDto): Promise<CourseLesson> {
    const courseLesson = await this.findOne(id);

    // Validar contenido si se está actualizando el tipo o contenido
    const updatedLesson = { ...courseLesson, ...updateCourseLessonDto };
    this.validateLessonContent(updatedLesson);

    try {
      Object.assign(courseLesson, updateCourseLessonDto);
      return await this.courseLessonRepository.save(courseLesson);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new BadRequestException(getUniqueViolationMessage(error));
      }
      throw error;
    }
  }

  async reorder(moduleId: string, reorderDto: ReorderCourseLessonsDto): Promise<CourseLesson[]> {
    const { items } = reorderDto;
    const lessonIds = items.map(item => item.id);

    const courseLessons = await this.courseLessonRepository.find({
      where: {
        id: In(lessonIds),
      },
    });

    if (courseLessons.length !== items.length) {
      throw new BadRequestException('Some course lessons not found');
    }

    try {
      for (const item of items) {
        const courseLesson = courseLessons.find(l => l.id === item.id);
        if (courseLesson) {
          courseLesson.position = item.position;
        }
      }

      await this.courseLessonRepository.save(courseLessons);

      return await this.courseLessonRepository.find({
        where: { moduleId },
        order: { position: 'ASC' },
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new BadRequestException(getUniqueViolationMessage(error));
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const courseLesson = await this.findOne(id);
    await this.courseLessonRepository.delete(courseLesson.id);
  }

  private async getNextPosition(moduleId: string): Promise<number> {
    const result = await this.courseLessonRepository
      .createQueryBuilder('courseLesson')
      .select('MAX(courseLesson.position)', 'maxPosition')
      .where('courseLesson.moduleId = :moduleId', { moduleId })
      .getRawOne();

    return (result?.maxPosition || 0) + 1;
  }

  private validateLessonContent(lessonData: CreateCourseLessonDto | UpdateCourseLessonDto | any): void {
    const { type, html, contentUrl } = lessonData;

    if (type === LessonType.TEXT) {
      if (!html || html.trim() === '') {
        throw new BadRequestException('HTML content is required for TEXT type lessons');
      }
    } else {
      if (!contentUrl || contentUrl.trim() === '') {
        throw new BadRequestException('Content URL is required for non-TEXT type lessons');
      }
    }
  }
}
