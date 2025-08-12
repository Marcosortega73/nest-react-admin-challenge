import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import { validate } from './config/env.validation';
import { CourseModule } from './course/course.module';
import { CourseLessonsModule } from './course-lessons/course-lessons.module';
import { CourseModulesModule } from './course-modules/course-modules.module';
import { CourseResourcesModule } from './course-resources/course-resources.module';
import { DatabaseModule } from './database/database.module';
import { EnrollmentModule } from './enrollments/enrollments.module';
import { StatsModule } from './stats/stats.module';
import { UserModule } from './user/user.module';
import { SeedModule } from './database/seeds/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      validate,
      cache: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    CourseModule,
    EnrollmentModule,
    CourseResourcesModule,
    CourseModulesModule,
    CourseLessonsModule,
    StatsModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
