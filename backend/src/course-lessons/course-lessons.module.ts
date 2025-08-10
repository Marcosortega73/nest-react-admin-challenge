import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseLesson } from './course-lesson.entity';
import { CourseLessonsController } from './course-lessons.controller';
import { CourseLessonsService } from './course-lessons.service';

@Module({
  imports: [TypeOrmModule.forFeature([CourseLesson])],
  controllers: [CourseLessonsController],
  providers: [CourseLessonsService],
  exports: [CourseLessonsService],
})
export class CourseLessonsModule {}
