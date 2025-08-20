// src/entities/follow.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column } from 'typeorm';
import { User } from './user.entity';

@Entity('follows')
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.following, { onDelete: 'CASCADE' })
  follower: User;

  @Column()
  followerId: number;

  @ManyToOne(() => User, user => user.followers, { onDelete: 'CASCADE' })
  following: User;

  @Column()
  followingId: number;
}