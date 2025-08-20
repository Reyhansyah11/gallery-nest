// src/entities/comment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Gallery } from './gallery.entity';
import { Album } from './album.entity';

export enum CommentType {
  GALLERY = 'gallery',
  ALBUM = 'album'
}

export enum CommentStatus {
  ACTIVE = 'active',
  HIDDEN = 'hidden',
  DELETED = 'deleted'
}

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: CommentType })
  type: CommentType;

  @Column({ type: 'enum', enum: CommentStatus, default: CommentStatus.ACTIVE })
  status: CommentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.comments, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Gallery, gallery => gallery.comments, { onDelete: 'CASCADE', nullable: true })
  gallery: Gallery;

  @Column({ nullable: true })
  galleryId: number;

  @ManyToOne(() => Album, album => album.comments, { onDelete: 'CASCADE', nullable: true })
  album: Album;

  @Column({ nullable: true })
  albumId: number;
}