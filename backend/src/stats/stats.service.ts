import { Injectable } from '@nestjs/common';

import { CourseService } from '../course/course.service';
import { UserService } from '../user/user.service';
import { StatsResponseDto } from './stats.dto';

@Injectable()
export class StatsService {
  constructor(
    private readonly userService: UserService,
    private readonly courseService: CourseService,
  ) {}
  async getStats(): Promise<StatsResponseDto> {
    const numberOfUsers = await this.userService.count();
    const numberOfCourses = await this.courseService.count();

    return { numberOfUsers, numberOfCourses };
  }
}
