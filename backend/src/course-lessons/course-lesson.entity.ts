import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { CourseModule } from '../course-modules/course-module.entity';

export enum LessonType {
  VIDEO = 'VIDEO',
  PDF = 'PDF',
  LINK = 'LINK',
  TEXT = 'TEXT',
}

@Entity('course_lessons')
@Unique('uq_course_lesson_position', ['moduleId', 'position'])
@Index('idx_course_lesson_module', ['moduleId'])
export class CourseLesson extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 180 })
  title: string;

  @Column({ length: 180, nullable: true })
  subtitle?: string;

  @Column({ type: 'int' })
  position: number;

  @Column({
    type: 'enum',
    enum: LessonType,
  })
  type: LessonType;

  @Column({ length: 1024, nullable: true })
  contentUrl?: string;

  @Column({ type: 'text', nullable: true })
  html?: string;

  @Column({ type: 'int', nullable: true })
  durationSec?: number;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @Column({ select: false, nullable: false })
  moduleId: string;

  @ManyToOne(() => CourseModule, module => module.lessons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'moduleId' })
  module: CourseModule;
}
