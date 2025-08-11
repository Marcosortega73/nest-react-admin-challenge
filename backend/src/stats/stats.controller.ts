import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { StatsResponseDto } from './stats.dto';
import { StatsService } from './stats.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('stats')
@ApiTags('Stats')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getStats(@CurrentUser() user: AuthenticatedUser): Promise<StatsResponseDto> {
    return await this.statsService.getStats(user?.userId);
  }
}
