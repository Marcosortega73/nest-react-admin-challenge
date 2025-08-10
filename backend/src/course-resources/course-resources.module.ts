import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseResource } from './course-resource.entity';
import { CourseResourcesController } from './course-resources.controller';
import { CourseResourcesService } from './course-resources.service';

@Module({
  imports: [TypeOrmModule.forFeature([CourseResource])],
  controllers: [CourseResourcesController],
  providers: [CourseResourcesService],
  exports: [CourseResourcesService],
})
export class CourseResourcesModule {}
