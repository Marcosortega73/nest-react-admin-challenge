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
  CreateCourseModuleDto,
  FindCourseModulesDto,
  ReorderCourseModulesDto,
  UpdateCourseModuleDto,
} from './course-module.dto';
import { CourseModule } from './course-module.entity';
import { CourseModulesService, PaginatedResult } from './course-modules.service';

@ApiTags('course-modules')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Controller('course-modules')
export class CourseModulesController {
  constructor(private readonly courseModulesService: CourseModulesService) {}

  @Post(':courseId/modules')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.Admin, Role.Editor)
  async create(
    @Param('courseId') courseId: string,
    @Body() createCourseModuleDto: CreateCourseModuleDto,
  ): Promise<CourseModule> {
    return await this.courseModulesService.create(courseId, createCourseModuleDto);
  }

  @Get()
  @Roles(Role.Admin, Role.Editor, Role.User)
  async findAll(
    @Param('courseId') courseId: string,
    @Query() query: FindCourseModulesDto,
  ): Promise<PaginatedResult<CourseModule>> {
    return await this.courseModulesService.findAll(courseId, query);
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Editor, Role.User)
  async findOne(@Param('id') id: string): Promise<CourseModule> {
    return await this.courseModulesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Editor)
  async update(@Param('id') id: string, @Body() updateCourseModuleDto: UpdateCourseModuleDto): Promise<CourseModule> {
    return await this.courseModulesService.update(id, updateCourseModuleDto);
  }

  @Patch('reorder')
  @Roles(Role.Admin, Role.Editor)
  async reorder(
    @Param('courseId') courseId: string,
    @Body() reorderDto: ReorderCourseModulesDto,
  ): Promise<CourseModule[]> {
    return await this.courseModulesService.reorder(courseId, reorderDto);
  }

  @Patch(':id/publish')
  @Roles(Role.Admin, Role.Editor)
  async publish(@Param('id') id: string): Promise<CourseModule> {
    return await this.courseModulesService.publish(id);
  }

  @Patch(':id/unpublish')
  @Roles(Role.Admin, Role.Editor)
  async unpublish(@Param('id') id: string): Promise<CourseModule> {
    return await this.courseModulesService.unpublish(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.Admin, Role.Editor)
  async delete(@Param('id') id: string): Promise<void> {
    return await this.courseModulesService.delete(id);
  }
}
