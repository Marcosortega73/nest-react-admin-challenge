import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Course } from '../course/course.entity';

export enum ResourceType {
  VIDEO = 'VIDEO',
  PDF = 'PDF',
  DOCUMENT = 'DOCUMENT',
  PRESENTATION = 'PRESENTATION',
  SPREADSHEET = 'SPREADSHEET',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  LINK = 'LINK',
  OTHER = 'OTHER',
}

@Entity('course_resources')
@Index('idx_course_resource_course', ['courseId'])
@Index('idx_course_resource_type', ['type'])
@Index('idx_course_resource_active', ['isActive'])
export class CourseResource extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 180 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ResourceType,
    default: ResourceType.OTHER,
  })
  type: ResourceType;

  @Column({ length: 500 })
  url: string;

  @Column({ type: 'bigint', nullable: true })
  fileSize?: number;

  @Column({ length: 100, nullable: true })
  mimeType?: string;

  @Column({ type: 'int', default: 0 })
  downloadCount: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ select: false, nullable: false })
  courseId: string;

  @ManyToOne(() => Course, (course) => course.resources, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseId' })
  course: Course;
}
