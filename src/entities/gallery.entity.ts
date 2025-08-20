import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Album } from './album.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { Collection } from './collection.entity';

@Entity('galleries')
export class Gallery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  tags: string;

  @Column({ default: false })
  isPrivate: boolean;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  downloadCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.galleries, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Album, album => album.galleries, { onDelete: 'CASCADE', nullable: true })
  album: Album;

  @Column({ nullable: true })
  albumId: number;

  @OneToMany(() => Like, like => like.gallery)
  likes: Like[];

  @OneToMany(() => Comment, comment => comment.gallery)
  comments: Comment[];

  @OneToMany(() => Collection, collection => collection.gallery)
  collections: Collection[];
}