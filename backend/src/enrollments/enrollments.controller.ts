import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserGuard } from '../auth/guards/user.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto.ts';
import { Enrollment } from './enrollments.entity';
import { EnrollmentService } from './enrollments.service';

@Controller('enrollments')
@ApiTags('Enrollments')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.Admin, Role.User)
  async save(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<Enrollment> {
    return await this.enrollmentService.save(createEnrollmentDto);
  }

  @Get()
  @Roles(Role.Admin, Role.User)
  async findAll(): Promise<Enrollment[]> {
    return await this.enrollmentService.findAll();
  }

  @Get('/:id')
  @UseGuards(UserGuard)
  async findOne(@Param('id') id: string): Promise<Enrollment> {
    return await this.enrollmentService.findById(id);
  }

  @Delete('/:id')
  @Roles(Role.Admin, Role.User)
  async delete(@Param('id') id: string): Promise<string> {
    return await this.enrollmentService.delete(id);
  }
}
