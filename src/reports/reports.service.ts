// src/reports/reports.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportType, ReportReason, ReportStatus } from '../entities/report.entity';
import { User, UserStatus } from '../entities/user.entity'; // Import UserStatus
import { Gallery } from '../entities/gallery.entity';
import { Album } from '../entities/album.entity';
import { Comment, CommentStatus } from '../entities/comment.entity'; // Import CommentStatus

export class CreateReportDto {
  type: ReportType;
  reason: ReportReason;
  description?: string;
  reportedUserId?: number;
  reportedGalleryId?: number;
  reportedAlbumId?: number;
  reportedCommentId?: number;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(reporterId: number, createReportDto: CreateReportDto): Promise<Report> {
    const report = this.reportRepository.create({
      ...createReportDto,
      reporterId,
    });

    return await this.reportRepository.save(report);
  }

  async findAll(status?: ReportStatus): Promise<Report[]> {
    const where = status ? { status } : {};
    
    return await this.reportRepository.find({
      where,
      relations: [
        'reporter',
        'reportedUser',
        'reportedGallery',
        'reportedAlbum',
        'reportedComment',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Report> {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: [
        'reporter',
        'reportedUser',
        'reportedGallery',
        'reportedAlbum',
        'reportedComment',
      ],
    });

    if (!report) {
      throw new NotFoundException('Laporan tidak ditemukan');
    }

    return report;
  }

  async updateStatus(
    id: number,
    status: ReportStatus,
    adminNote?: string,
  ): Promise<Report> {
    const report = await this.reportRepository.findOne({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Laporan tidak ditemukan');
    }

    report.status = status;
    if (adminNote) {
      report.adminNote = adminNote;
    }

    return await this.reportRepository.save(report);
  }

  async resolveReport(id: number, adminNote?: string): Promise<void> {
    const report = await this.findOne(id);

    // Handle different types of reports
    switch (report.type) {
      case ReportType.GALLERY:
        if (report.reportedGallery) {
          await this.galleryRepository.remove(report.reportedGallery);
        }
        break;
      case ReportType.ALBUM:
        if (report.reportedAlbum) {
          await this.albumRepository.remove(report.reportedAlbum);
        }
        break;
      case ReportType.USER:
        if (report.reportedUser) {
          report.reportedUser.status = UserStatus.BANNED; // Gunakan enum
          await this.userRepository.save(report.reportedUser);
        }
        break;
      case ReportType.COMMENT:
        if (report.reportedComment) {
          report.reportedComment.status = CommentStatus.HIDDEN; // Gunakan enum
          await this.commentRepository.save(report.reportedComment);
        }
        break;
    }

    await this.updateStatus(id, ReportStatus.RESOLVED, adminNote);
  }
}