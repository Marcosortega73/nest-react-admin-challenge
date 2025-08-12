// src/seed/seed.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'user/user.entity';
import { Role } from 'enums/role.enum';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async run() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const username = this.config.get<string>('ADMIN_USERNAME', 'admin');
    const password = this.config.get<string>('ADMIN_PASSWORD');
    const firstName = this.config.get<string>('ADMIN_FIRST_NAME', 'admin');
    const lastName = this.config.get<string>('ADMIN_LAST_NAME', 'admin');
    const rounds = Number(this.config.get<number>('BCRYPT_ROUNDS', 10));

    if (!password) {
      this.logger.warn('ADMIN_PASSWORD not set. Omit seed.');
      return;
    }

    const exists = await this.users.findOne({ where: { username } });
    
    if (exists) {
      this.logger.log(`Admin "${username}" already exists. Seed idempotent.`);
      return;
    }

    const hash = await bcrypt.hash(password, rounds);

    const admin = this.users.create({
      username,
      firstName,
      lastName,
      isActive: true,
      role: Role.Admin,
      password: hash,
    });

    await this.users.save(admin);
    this.logger.log(`Admin "${username}" created.`);
  }
}
