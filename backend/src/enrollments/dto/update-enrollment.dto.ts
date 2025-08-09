import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { EnrollmentStatus } from 'enrollments/enrollments.entity';

export class UpdateEnrollmentDto {
  @IsEnum(EnrollmentStatus)
  @IsOptional()
  status?: EnrollmentStatus;

  @IsDateString()
  @IsOptional()
  completedAt?: string;
}
