// src/entities/like.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column } from 'typeorm';
import { User } from './user.entity';
import { Gallery } from './gallery.entity';
import { Album } from './album.entity';

export enum LikeType {
  GALLERY = 'gallery',
  ALBUM = 'album'
}

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: LikeType })
  type: LikeType;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.likes, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Gallery, gallery => gallery.likes, { onDelete: 'CASCADE', nullable: true })
  gallery: Gallery;

  @Column({ nullable: true })
  galleryId: number;

  @ManyToOne(() => Album, album => album.likes, { onDelete: 'CASCADE', nullable: true })
  album: Album;

  @Column({ nullable: true })
  albumId: number;
}