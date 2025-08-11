import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CourseResource } from '../course-resources/course-resource.entity';
import { Enrollment } from '../enrollments/enrollments.entity';
import { CourseModule } from 'course-modules/course-module.entity';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

@Entity()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  @IsString()
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  isPublished: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CourseResource, resource => resource.course)
  resources: CourseResource[];

  @OneToMany(() => Enrollment, enrollment => enrollment.course)
  enrollments: Enrollment[];

  @OneToMany(() => CourseModule, module => module.course)
  modules: CourseModule[];
}
