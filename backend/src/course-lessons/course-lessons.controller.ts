import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import {
  CreateCourseLessonDto,
  FindCourseLessonsDto,
  ReorderCourseLessonsDto,
  UpdateCourseLessonDto,
} from './course-lesson.dto';
import { CourseLesson } from './course-lesson.entity';
import {
  CourseLessonsService,
  PaginatedResult,
} from './course-lessons.service';

@ApiTags('course-lessons')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Controller('course-lessons')
export class CourseLessonsController {
  constructor(private readonly courseLessonsService: CourseLessonsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.Admin, Role.Editor)
  async create(
    @Body() createCourseLessonDto: CreateCourseLessonDto,
  ): Promise<CourseLesson> {
    return await this.courseLessonsService.create(
      createCourseLessonDto.moduleId,
      createCourseLessonDto,
    );
  }

  @Get()
  @Roles(Role.Admin, Role.Editor, Role.User)
  async findAll(
    @Param('moduleId') moduleId: string,
    @Query() query: FindCourseLessonsDto,
  ): Promise<PaginatedResult<CourseLesson>> {
    return await this.courseLessonsService.findAll(moduleId, query);
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Editor, Role.User)
  async findOne(
    @Param('id') id: string,
  ): Promise<CourseLesson> {
    return await this.courseLessonsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Editor)
  async update(
    @Param('id') id: string,
    @Body() updateCourseLessonDto: UpdateCourseLessonDto,
  ): Promise<CourseLesson> {
    return await this.courseLessonsService.update(
      id,
      updateCourseLessonDto,
    );
  }

  @Patch('reorder')
  @Roles(Role.Admin, Role.Editor)
  async reorder(
    @Param('moduleId') moduleId: string,
    @Body() reorderDto: ReorderCourseLessonsDto,
  ): Promise<CourseLesson[]> {
    return await this.courseLessonsService.reorder(moduleId, reorderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.Admin, Role.Editor)
  async delete(
    @Param('id') id: string,
  ): Promise<void> {
    return await this.courseLessonsService.delete(id);
  }
}
