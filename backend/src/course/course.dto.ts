import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { UpdateCourseLessonDto } from 'course-lessons/course-lesson.dto';
import { UpdateCourseModuleDto } from 'course-modules/course-module.dto';
import { UpdateCourseResourceDto } from 'course-resources/course-resource.dto';

// DTOs anidados para la creación completa
export class CreateCourseResourceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: 'pdf' | 'url' | 'zip';

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class CreateCourseModuleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class CreateCourseLessonDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsNotEmpty()
  moduleIndex: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCourseResourceDto)
  resources?: CreateCourseResourceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCourseModuleDto)
  modules?: CreateCourseModuleDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCourseLessonDto)
  lessons?: CreateCourseLessonDto[];
}

export class UpdateCourseDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCourseResourceDto)
  resources?: UpdateCourseResourceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCourseModuleDto)
  modules?: UpdateCourseModuleDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCourseLessonDto)
  lessons?: UpdateCourseLessonDto[];
}
