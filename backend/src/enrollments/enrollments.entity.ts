import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Course } from '../course/course.entity';
import { User } from '../user/user.entity';

export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum EnrollmentSource {
  SELF = 'SELF',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
}

@Entity('enrollments')
@Unique('uq_enrollment_user_course', ['userId', 'courseId'])
export class Enrollment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_enrollment_user')
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Index('idx_enrollment_course')
  @Column({ type: 'uuid' })
  courseId: string;

  @ManyToOne(() => Course, (course) => course.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ACTIVE,
  })
  status: EnrollmentStatus;

  @Column({
    type: 'enum',
    enum: EnrollmentSource,
    default: EnrollmentSource.SELF,
  })
  source: EnrollmentSource;

  @CreateDateColumn()
  enrolledAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt?: Date;

  /* @OneToMany(() => LessonProgress, p => p.enrollment)
  progress: LessonProgress[]; */
}
