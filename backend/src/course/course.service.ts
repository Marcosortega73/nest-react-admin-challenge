import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, ILike } from 'typeorm';

import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseQuery } from './course.query';
import { CourseModule } from '../course-modules/course-module.entity';
import { CourseLesson, LessonType } from '../course-lessons/course-lesson.entity';
import { CourseResource, ResourceType } from '../course-resources/course-resource.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Role } from '../enums/role.enum';

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
            isPublished: l.isPublished ?? l.isPublished ?? false,
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

  async findAll(courseQuery: CourseQuery, userRole?: Role, userId?: string): Promise<Course[]> {
    // Apply filter-based logic first to determine join strategy
    const filter = courseQuery.filter || 'all';
    
    
    let queryBuilder: any;
    
    
    if (filter === 'my-courses' && userId) {
      queryBuilder = Course.createQueryBuilder('course')
        .leftJoinAndSelect('course.modules', 'modules')
        .leftJoinAndSelect('modules.lessons', 'lessons')
        .leftJoinAndSelect('course.resources', 'resources')
        .innerJoinAndSelect('course.enrollments', 'enrollments', 'enrollments.userId = :userId AND enrollments.status = :status', { 
          userId, 
          status: 'ACTIVE' 
        })
        .orderBy('course.name', 'ASC')
        .addOrderBy('course.description', 'ASC')
        .addOrderBy('modules.position', 'ASC')
        .addOrderBy('lessons.position', 'ASC');
      
      if (userRole === Role.User) {
        queryBuilder.andWhere('course.isPublished = :isPublished', { isPublished: true });
      }
    } else {
      queryBuilder = Course.createQueryBuilder('course')
        .leftJoinAndSelect('course.modules', 'modules')
        .leftJoinAndSelect('modules.lessons', 'lessons')
        .leftJoinAndSelect('course.resources', 'resources')
        .leftJoinAndSelect('course.enrollments', 'enrollments')
        .orderBy('course.name', 'ASC')
        .addOrderBy('course.description', 'ASC')
        .addOrderBy('modules.position', 'ASC')
        .addOrderBy('lessons.position', 'ASC');
    }

    if (courseQuery.search && courseQuery.search.trim()) {
      const searchTerm = `%${courseQuery.search.trim()}%`;
      queryBuilder.andWhere(
        '(course.name ILIKE :search OR course.description ILIKE :search)',
        { search: searchTerm }
      );
    }

    switch (filter) {
      case 'all':
        if (userRole === Role.User) {
          queryBuilder
            .andWhere('course.isPublished = :isPublished', { isPublished: true })
            .andWhere('modules.id IS NOT NULL')
            .andWhere('lessons.id IS NOT NULL');
        }
        break;

      case 'my-courses':
        break;

      case 'published':
        if (userRole !== Role.User) {
          queryBuilder.andWhere('course.isPublished = :isPublished', { isPublished: true });
        }
        break;

      case 'draft':
        if (userRole !== Role.User) {
          queryBuilder.andWhere('course.isPublished = :isPublished', { isPublished: false });
        }
        break;
    }

    const courses = await queryBuilder.getMany();

    if (userRole === Role.User && filter === 'all') {
      const filteredCourses = courses.filter(course => 
        course.modules && 
        course.modules.length > 0 && 
        course.modules.some(module => module.lessons && module.lessons.length > 0)
      );
      return filteredCourses;
    }

    return courses;
  }

  async getCounts(userRole?: Role, userId?: string) {
    // Base query for counting
    const baseQuery = Course.createQueryBuilder('course')
      .leftJoinAndSelect('course.modules', 'modules')
      .leftJoinAndSelect('modules.lessons', 'lessons')
      .leftJoinAndSelect('course.enrollments', 'enrollments');

    // Count all courses (respecting user role)
    let allQuery = baseQuery.clone();
    if (userRole === Role.User) {
      allQuery = allQuery
        .andWhere('course.isPublished = :isPublished', { isPublished: true });
    }
    const allCourses = await allQuery.getMany();
    const allCount = userRole === Role.User 
      ? allCourses.filter(course => 
          course.modules && 
          course.modules.length > 0 && 
          course.modules.some(module => module.lessons && module.lessons.length > 0)
        ).length
      : allCourses.length;

    // Count my courses (enrolled courses)
    let myCoursesCount = 0;
    if (userId) {
      const myCoursesQuery = baseQuery.clone()
        .andWhere('enrollments.userId = :userId', { userId });
      const myCourses = await myCoursesQuery.getMany();
      myCoursesCount = myCourses.length;
    }

    // Count published courses (only for admin/editor)
    let publishedCount = 0;
    if (userRole !== Role.User) {
      const publishedQuery = baseQuery.clone()
        .andWhere('course.isPublished = :isPublished', { isPublished: true });
      const publishedCourses = await publishedQuery.getMany();
      publishedCount = publishedCourses.length;
    }

    // Count draft courses (only for admin/editor)
    let draftCount = 0;
    if (userRole !== Role.User) {
      const draftQuery = baseQuery.clone()
        .andWhere('course.isPublished = :isPublished', { isPublished: false });
      const draftCourses = await draftQuery.getMany();
      draftCount = draftCourses.length;
    }

    return {
      all: allCount,
      myCourses: myCoursesCount,
      published: publishedCount,
      draft: draftCount,
    };
  }

  async findById(id: string): Promise<Course> {
    const course = await Course.findOne({ 
      where: { id }, 
      relations: ['modules', 'modules.lessons', 'resources', 'enrollments'] 
    });
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
