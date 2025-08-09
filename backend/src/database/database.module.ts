import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService): TypeOrmModuleOptions =>
        configService.get<TypeOrmModuleOptions>('database'),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
