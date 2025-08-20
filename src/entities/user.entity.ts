import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Album } from './album.entity';
import { Gallery } from './gallery.entity';
import { Collection } from './collection.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { Follow } from './follow.entity';
import { Report } from './report.entity';
import { Notification } from './notification.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
  SUSPENDED = 'suspended'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ default: false })
  isPrivate: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Album, album => album.user)
  albums: Album[];

  @OneToMany(() => Gallery, gallery => gallery.user)
  galleries: Gallery[];

  @OneToMany(() => Collection, collection => collection.user)
  collections: Collection[];

  @OneToMany(() => Like, like => like.user)
  likes: Like[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(() => Follow, follow => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, follow => follow.following)
  followers: Follow[];

  @OneToMany(() => Report, report => report.reporter)
  reports: Report[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];
}