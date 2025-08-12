import { Injectable } from '@nestjs/common';

import { CourseService } from '../course/course.service';
import { UserService } from '../user/user.service';
import { StatsResponseDto } from './stats.dto';
import { Enrollment, EnrollmentStatus } from '../enrollments/enrollments.entity';
import { Course } from '../course/course.entity';

@Injectable()
export class StatsService {
  constructor(
    private readonly userService: UserService,
    private readonly courseService: CourseService,
  ) {}
  async getStats(userId?: string): Promise<StatsResponseDto> {
    const numberOfUsers = await this.userService.count();
    const numberOfCourses = await this.courseService.count();
    
    // Count active enrollments
    const numberOfEnrollments = await Enrollment.count({
      where: { status: EnrollmentStatus.ACTIVE }
    });
    
    // Count published courses
    const numberOfPublishedCourses = await Course.count({
      where: { isPublished: true }
    });

    // Count user's enrolled courses if userId is provided
    let myCoursesNumberOfEnrollments: number | undefined;
    if (userId) {
      myCoursesNumberOfEnrollments = await Enrollment.count({
        where: { 
          userId: userId,
          status: EnrollmentStatus.ACTIVE 
        }
      });
    }

    return { 
      numberOfUsers, 
      numberOfCourses, 
      numberOfEnrollments,
      numberOfPublishedCourses,
      myCoursesNumberOfEnrollments
    };
  }
}
