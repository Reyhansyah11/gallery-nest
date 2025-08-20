// src/reports/reports.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '../entities/report.entity';
import { User } from '../entities/user.entity';
import { Gallery } from '../entities/gallery.entity';
import { Album } from '../entities/album.entity';
import { Comment } from '../entities/comment.entity';
import { ReportsService } from '../reports/reports.service';
import { ReportsController } from '../reports/reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Report, User, Gallery, Album, Comment])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}