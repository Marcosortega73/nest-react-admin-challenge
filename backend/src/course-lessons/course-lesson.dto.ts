import { PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { LessonType } from './course-lesson.entity';

export class CreateCourseLessonDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(180)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  subtitle?: string;

  @IsOptional()
  @IsPositive()
  position?: number;

  @IsNotEmpty()
  @IsEnum(LessonType)
  type: LessonType;

  @ValidateIf((o) => o.type !== LessonType.TEXT)
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(1024)
  contentUrl?: string;

  @ValidateIf((o) => o.type === LessonType.TEXT)
  @IsNotEmpty()
  @IsString()
  html?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationSec?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateCourseLessonDto extends PartialType(CreateCourseLessonDto) {
  moduleIndex: number;
  isPublished: boolean;
}

export class FindCourseLessonsDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  q?: string;
}

export class ReorderCourseLessonItemDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsPositive()
  position: number;
}

export class ReorderCourseLessonsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReorderCourseLessonItemDto)
  items: ReorderCourseLessonItemDto[];
}
