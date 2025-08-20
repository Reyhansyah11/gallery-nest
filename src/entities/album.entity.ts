// src/entities/album.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Gallery } from './gallery.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ default: false })
  isPrivate: boolean;

  @Column({ default: 0 })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.albums, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => Gallery, gallery => gallery.album, { cascade: true })
  galleries: Gallery[];

  @OneToMany(() => Like, like => like.album)
  likes: Like[];

  @OneToMany(() => Comment, comment => comment.album)
  comments: Comment[];
}