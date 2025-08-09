import { Module } from '@nestjs/common';

import { EnrollmentController } from './enrollments.controller';
import { EnrollmentService } from './enrollments.service';

@Module({
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
