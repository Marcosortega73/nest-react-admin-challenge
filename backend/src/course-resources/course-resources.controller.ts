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
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import {
  CreateCourseResourceDto,
  FindCourseResourcesDto,
  UpdateCourseResourceDto,
} from './course-resource.dto';
import { CourseResource } from './course-resource.entity';
import {
  CourseResourcesService,
  PaginatedResult,
} from './course-resources.service';

@ApiTags('course-resources')
@ApiBearerAuth()
@Controller('courses/:courseId/resources')
@UseGuards(JwtGuard, RolesGuard)
export class CourseResourcesController {
  constructor(
    private readonly courseResourcesService: CourseResourcesService,
  ) {}

  @Post()
  @Roles(Role.Admin, Role.Editor)
  @ApiOperation({ summary: 'Create a new course resource' })
  async create(
    @Param('courseId') courseId: string,
    @Body() createCourseResourceDto: CreateCourseResourceDto,
  ): Promise<CourseResource> {
    return await this.courseResourcesService.create(
      courseId,
      createCourseResourceDto,
    );
  }

  @Get()
  @Roles(Role.Admin, Role.Editor, Role.User)
  @ApiOperation({ summary: 'Get all resources for a course' })
  async findAll(
    @Param('courseId') courseId: string,
    @Query() findCourseResourcesDto: FindCourseResourcesDto,
  ): Promise<PaginatedResult<CourseResource>> {
    return await this.courseResourcesService.findAll(
      courseId,
      findCourseResourcesDto,
    );
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Editor, Role.User)
  @ApiOperation({ summary: 'Get a specific course resource' })
  async findOne(
    @Param('courseId') courseId: string,
    @Param('id') id: string,
  ): Promise<CourseResource> {
    return await this.courseResourcesService.findOne(courseId, id);
  }

  @Put(':id')
  @Roles(Role.Admin, Role.Editor)
  @ApiOperation({ summary: 'Update a course resource' })
  async update(
    @Param('courseId') courseId: string,
    @Param('id') id: string,
    @Body() updateCourseResourceDto: UpdateCourseResourceDto,
  ): Promise<CourseResource> {
    return await this.courseResourcesService.update(
      courseId,
      id,
      updateCourseResourceDto,
    );
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Editor)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a course resource' })
  async remove(
    @Param('courseId') courseId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return await this.courseResourcesService.remove(courseId, id);
  }

  @Patch(':id/download')
  @Roles(Role.Admin, Role.Editor, Role.User)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Increment download count for a resource' })
  async incrementDownload(
    @Param('courseId') courseId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return await this.courseResourcesService.incrementDownloadCount(
      courseId,
      id,
    );
  }

  @Patch(':id/toggle-active')
  @Roles(Role.Admin, Role.Editor)
  @ApiOperation({ summary: 'Toggle active status of a course resource' })
  async toggleActive(
    @Param('courseId') courseId: string,
    @Param('id') id: string,
  ): Promise<CourseResource> {
    return await this.courseResourcesService.toggleActive(courseId, id);
  }

  @Get('by-type/:type')
  @Roles(Role.Admin, Role.Editor, Role.User)
  @ApiOperation({ summary: 'Get resources by type' })
  async getResourcesByType(
    @Param('courseId') courseId: string,
    @Param('type') type: string,
  ): Promise<CourseResource[]> {
    return await this.courseResourcesService.getResourcesByType(courseId, type);
  }
}
