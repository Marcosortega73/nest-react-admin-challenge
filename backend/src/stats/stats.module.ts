import { Module } from '@nestjs/common';

import { CourseModule } from '../course/course.module';
import { UserModule } from '../user/user.module';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [UserModule, CourseModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
