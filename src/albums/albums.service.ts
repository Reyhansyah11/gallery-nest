// src/albums/albums.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from '../entities/album.entity';
import { User } from '../entities/user.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async create(userId: number, createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album = this.albumRepository.create({
      ...createAlbumDto,
      userId,
    });

    return await this.albumRepository.save(album);
  }

  async findAll(userId: number, targetUserId?: number): Promise<Album[]> {
    const whereConditions: any = {};
    
    if (targetUserId) {
      whereConditions.userId = targetUserId;
      // If viewing others' albums, only show public ones unless it's the owner
      if (targetUserId !== userId) {
        whereConditions.isPrivate = false;
      }
    } else {
      whereConditions.userId = userId;
    }

    return await this.albumRepository.find({
      where: whereConditions,
      relations: ['user', 'galleries'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Album> {
    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ['user', 'galleries', 'likes', 'comments'],
    });

    if (!album) {
      throw new NotFoundException('Album tidak ditemukan');
    }

    // Check privacy
    if (album.isPrivate && album.userId !== userId) {
      throw new ForbiddenException('Album ini private');
    }

    // Increment view count if not owner
    if (album.userId !== userId) {
      album.viewCount += 1;
      await this.albumRepository.save(album);
    }

    return album;
  }

  async update(id: number, userId: number, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.albumRepository.findOne({
      where: { id, userId },
    });

    if (!album) {
      throw new NotFoundException('Album tidak ditemukan atau tidak memiliki akses');
    }

    Object.assign(album, updateAlbumDto);
    return await this.albumRepository.save(album);
  }

  async remove(id: number, userId: number): Promise<void> {
    const album = await this.albumRepository.findOne({
      where: { id, userId },
    });

    if (!album) {
      throw new NotFoundException('Album tidak ditemukan atau tidak memiliki akses');
    }

    await this.albumRepository.remove(album);
  }

  async getUserAlbums(userId: number): Promise<Album[]> {
    return await this.albumRepository.find({
      where: { userId },
      relations: ['galleries'],
      order: { createdAt: 'DESC' },
    });
  }
}