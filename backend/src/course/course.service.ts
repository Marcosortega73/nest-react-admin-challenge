import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, ILike } from 'typeorm';

import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseQuery } from './course.query';
import { CourseModule } from '../course-modules/course-module.entity';
import { CourseLesson, LessonType } from '../course-lessons/course-lesson.entity';
import { CourseResource, ResourceType } from '../course-resources/course-resource.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class CourseService {
  constructor(private readonly dataSource: DataSource) {}

  private mapResourceType(t: string): ResourceType {
    switch (t?.toLowerCase()) {
      case 'pdf':
        return ResourceType.PDF;
      case 'url':
        return ResourceType.LINK;
      case 'zip':
        return ResourceType.DOCUMENT;
      default:
        return ResourceType.OTHER;
    }
  }

  async save(createCourseDto: CreateCourseDto): Promise<Course> {
    return this.dataSource
      .transaction(async manager => {
        const course = await manager.save(
          manager.create(Course, {
            name: createCourseDto.name.trim(),
            description: createCourseDto.description?.trim(),
            imageUrl: createCourseDto?.imageUrl?.trim(),
            isPublished: createCourseDto.isPublished ?? false,
            dateCreated: new Date(),
          }),
        );

        const modules = (createCourseDto.modules ?? []).map((m, i) =>
          manager.create(CourseModule, {
            title: m.title?.trim(),
            description: m.description?.trim(),
            position: i + 1,
            isPublished: m.isPublished ?? false,
            course,
          }),
        );
        if (modules.length) await manager.save(modules);

        const byModuleIndex = modules;
        if ((createCourseDto.lessons?.length ?? 0) > 0 && modules.length === 0) {
          throw new BadRequestException('No se pueden crear lecciones sin módulos');
        }
        const counters = new Map<string, number>();
        const lessons = (createCourseDto.lessons ?? []).map(l => {
          const m = byModuleIndex[l.moduleIndex ?? 0] ?? byModuleIndex[0];
          const pos = (counters.get(m.id) ?? 0) + 1;
          counters.set(m.id, pos);
          return manager.create(CourseLesson, {
            title: l.title?.trim(),
            contentUrl: l.content?.trim(),
            position: pos,
            type: LessonType.LINK,
            isPreview: l.isPublished ?? false,
            module: m,
          });
        });
        if (lessons.length) await manager.save(lessons);

        const resources = (createCourseDto.resources ?? []).map(r =>
          manager.create(CourseResource, {
            title: r.name?.trim(),
            type: this.mapResourceType(r.type),
            url: r.url?.trim(),
            isActive: r.isPublished ?? true,
            course,
          }),
        );
        if (resources.length) await manager.save(resources);

        return manager.findOneOrFail(Course, {
          where: { id: course.id },
          relations: ['modules', 'modules.lessons', 'resources'],
          order: { modules: { position: 'ASC' } },
        });
      })
      .catch(e => {
        if (e?.code === '23505') throw new BadRequestException('Course already exists');
        throw e;
      });
  }

  async findAll(courseQuery: CourseQuery): Promise<Course[]> {
    Object.keys(courseQuery).forEach(key => {
      courseQuery[key] = ILike(`%${courseQuery[key]}%`);
    });
    return (await Course.find({
      where: courseQuery,
      relations: ['modules', 'modules.lessons', 'resources'],
      order: {
        name: 'ASC',
        description: 'ASC',
      },
    })) as Course[];
  }

  async findById(id: string): Promise<Course> {
    const course = await Course.findOne({ where: { id }, relations: ['modules', 'modules.lessons', 'resources'] });
    if (!course) {
      throw new HttpException(`Could not find course with matching id ${id}`, HttpStatus.NOT_FOUND);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    return this.dataSource.transaction(async manager => {
      const course = await manager.findOne(Course, {
        where: { id },
        relations: ['modules', 'modules.lessons', 'resources'],
      });
      if (!course) throw new NotFoundException('Course not found');

      course.name = updateCourseDto.name?.trim() ?? course.name;
      course.description = updateCourseDto.description?.trim() ?? course.description;
      course.imageUrl = updateCourseDto.imageUrl?.trim() ?? course.imageUrl;
      course.isPublished = updateCourseDto.isPublished ?? course.isPublished;
      await manager.save(course);

      if (updateCourseDto.modules) {
        await manager.delete(CourseModule, { course: { id: course.id } });
        const modules = updateCourseDto.modules.map((m, i) =>
          manager.create(CourseModule, {
            title: m.title?.trim(),
            description: m.description?.trim(),
            position: i + 1,
            isPublished: m.isPublished ?? false,
            course,
          }),
        );
        await manager.save(modules);
      }

      if (updateCourseDto.lessons) {
        await manager.delete(CourseLesson, { module: { course: { id: course.id } } });
        const byModuleIndex = await manager.find(CourseModule, {
          where: { course: { id: course.id } },
          order: { position: 'ASC' },
        });
        const counters = new Map<string, number>();
        const lessons = updateCourseDto.lessons.map(l => {
          const m = byModuleIndex[l.moduleIndex ?? 0] ?? byModuleIndex[0];
          const pos = (counters.get(m.id) ?? 0) + 1;
          counters.set(m.id, pos);
          return manager.create(CourseLesson, {
            title: l.title?.trim(),
            contentUrl: l.contentUrl?.trim(),
            position: pos,
            type: LessonType.LINK,
            isPublished: l.isPublished ?? false,
            module: m,
          });
        });
        await manager.save(lessons);
      }

      if (updateCourseDto.resources) {
        await manager.delete(CourseResource, { course: { id: course.id } });
        const resources = updateCourseDto.resources.map(r =>
          manager.create(CourseResource, {
            title: r.title?.trim(),
            type: this.mapResourceType(r.type),
            url: r.url?.trim(),
            isActive: r.isActive ?? true,
            course,
          }),
        );
        await manager.save(resources);
      }

      return manager.findOneOrFail(Course, {
        where: { id: course.id },
        relations: ['modules', 'modules.lessons', 'resources'],
        order: { modules: { position: 'ASC' } },
      });
    });
  }

  async delete(id: string): Promise<string> {
    const course = await this.findById(id);
    if (!course) throw new NotFoundException('Course not found');

    await Course.remove(course);
    return 'Course deleted successfully';
  }

  async count(): Promise<number> {
    return await Course.count();
  }
}
