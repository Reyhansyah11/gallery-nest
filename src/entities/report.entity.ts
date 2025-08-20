// src/entities/report.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Gallery } from './gallery.entity';
import { Album } from './album.entity';
import { Comment } from './comment.entity';

export enum ReportType {
  USER = 'user',
  GALLERY = 'gallery',
  ALBUM = 'album',
  COMMENT = 'comment'
}

export enum ReportReason {
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  SPAM = 'spam',
  HARASSMENT = 'harassment',
  COPYRIGHT = 'copyright',
  OTHER = 'other'
}

export enum ReportStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  RESOLVED = 'resolved',
  REJECTED = 'rejected'
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ReportType })
  type: ReportType;

  @Column({ type: 'enum', enum: ReportReason })
  reason: ReportReason;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  @Column({ type: 'text', nullable: true })
  adminNote: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.reports, { onDelete: 'CASCADE' })
  reporter: User;

  @Column()
  reporterId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  reportedUser: User;

  @Column({ nullable: true })
  reportedUserId: number;

  @ManyToOne(() => Gallery, { onDelete: 'CASCADE', nullable: true })
  reportedGallery: Gallery;

  @Column({ nullable: true })
  reportedGalleryId: number;

  @ManyToOne(() => Album, { onDelete: 'CASCADE', nullable: true })
  reportedAlbum: Album;

  @Column({ nullable: true })
  reportedAlbumId: number;

  @ManyToOne(() => Comment, { onDelete: 'CASCADE', nullable: true })
  reportedComment: Comment;

  @Column({ nullable: true })
  reportedCommentId: number;
}