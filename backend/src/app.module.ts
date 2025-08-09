import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import { validate } from './config/env.validation';
import { ContentModule } from './content/content.module';
import { CourseModule } from './course/course.module';
import { DatabaseModule } from './database/database.module';
import { EnrollmentModule } from './enrollments/enrollments.module';
import { StatsModule } from './stats/stats.module';
import { UserModule } from './user/user.module';

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
    ContentModule,
    StatsModule,
    EnrollmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
