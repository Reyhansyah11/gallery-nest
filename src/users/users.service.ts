// src/users/users.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Follow } from '../entities/follow.entity';

export class UpdateProfileDto {
  fullName?: string;
  username?: string;
  bio?: string;
  avatar?: string;
  isPrivate?: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}

  async getProfile(userId: number, targetUserId?: number): Promise<Omit<User, 'password'>> {
    const targetId = targetUserId || userId;
    
    const user = await this.userRepository.findOne({
      where: { id: targetId },
      relations: ['albums', 'galleries', 'followers', 'following'],
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    // Check privacy
    if (user.isPrivate && targetUserId && targetUserId !== userId) {
      const isFollowing = await this.followRepository.findOne({
        where: { followerId: userId, followingId: targetUserId },
      });

      if (!isFollowing) {
        throw new ForbiddenException('Profile ini private');
      }
    }

    // Destructure untuk menghilangkan password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: number, updateData: UpdateProfileDto): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    // Check if username is unique (if being updated)
    if (updateData.username && updateData.username !== user.username) {
      const existingUser = await this.userRepository.findOne({ 
        where: { username: updateData.username } 
      });
      
      if (existingUser) {
        throw new ForbiddenException('Username sudah digunakan');
      }
    }

    Object.assign(user, updateData);
    const updatedUser = await this.userRepository.save(user);
    
    // Destructure untuk menghilangkan password
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async followUser(followerId: number, followingId: number): Promise<void> {
    if (followerId === followingId) {
      throw new ForbiddenException('Tidak bisa follow diri sendiri');
    }

    const targetUser = await this.userRepository.findOne({ where: { id: followingId } });
    if (!targetUser) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const existingFollow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });

    if (existingFollow) {
      throw new ForbiddenException('Sudah following user ini');
    }

    const follow = this.followRepository.create({
      followerId,
      followingId,
    });

    await this.followRepository.save(follow);
  }

  async unfollowUser(followerId: number, followingId: number): Promise<void> {
    const follow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });

    if (!follow) {
      throw new NotFoundException('Tidak sedang following user ini');
    }

    await this.followRepository.remove(follow);
  }

  async getFollowers(userId: number): Promise<Omit<User, 'password'>[]> {
    const follows = await this.followRepository.find({
      where: { followingId: userId },
      relations: ['follower'],
    });

    return follows.map(follow => {
      const { password, ...followerWithoutPassword } = follow.follower;
      return followerWithoutPassword;
    });
  }

  async getFollowing(userId: number): Promise<Omit<User, 'password'>[]> {
    const follows = await this.followRepository.find({
      where: { followerId: userId },
      relations: ['following'],
    });

    return follows.map(follow => {
      const { password, ...followingWithoutPassword } = follow.following;
      return followingWithoutPassword;
    });
  }
}