import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';

import { CreateEnrollmentDto } from './dto/create-enrollment.dto.ts';
import { Enrollment } from './enrollments.entity';

@Injectable()
export class EnrollmentService {
  async save(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    try {
      return await Enrollment.create({
        ...createEnrollmentDto,
      }).save();
    } catch (error) {
      throw new HttpException(
        `Could not create enrollment with matching id ${createEnrollmentDto.userId}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Enrollment[]> {
    return Enrollment.find() as Promise<Enrollment[]>;
  }

  async findById(id: string): Promise<Enrollment> {
    const enrollment = await Enrollment.findOne({ where: { id } });

    if (!enrollment) {
      throw new HttpException(
        `Could not find enrollment with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return enrollment;
  }

  async delete(id: string): Promise<string> {
    await Enrollment.delete(id);
    return id;
  }
}
