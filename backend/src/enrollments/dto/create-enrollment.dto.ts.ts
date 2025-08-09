import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { validate } from 'class-validator';
import {
  EnrollmentSource,
  EnrollmentStatus,
} from 'enrollments/enrollments.entity';

export class CreateEnrollmentDto {
  @IsNotEmpty({ message: 'User id is required' })
  @IsString()
  userId!: string;

  @IsNotEmpty({ message: 'Course id is required' })
  @IsString()
  courseId!: string;

  @IsEnum(EnrollmentSource, { message: 'Source is not valid' })
  @IsOptional()
  source?: EnrollmentSource;

  @IsEnum(EnrollmentStatus, { message: 'Status is not valid' })
  @IsOptional()
  @IsString()
  status?: EnrollmentStatus;
}
