// src/galleries/galleries.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gallery } from '../entities/gallery.entity';
import { Album } from '../entities/album.entity';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Injectable()
export class GalleriesService {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async create(userId: number, createGalleryDto: CreateGalleryDto, imageUrl: string): Promise<Gallery> {
    // Check if album exists and belongs to user
    if (createGalleryDto.albumId) {
      const album = await this.albumRepository.findOne({
        where: { id: createGalleryDto.albumId, userId },
      });

      if (!album) {
        throw new NotFoundException('Album tidak ditemukan atau tidak memiliki akses');
      }
    }

    const gallery = this.galleryRepository.create({
      ...createGalleryDto,
      userId,
      imageUrl,
    });

    return await this.galleryRepository.save(gallery);
  }

  async findAll(userId: number, page = 1, limit = 20): Promise<{ data: Gallery[]; total: number }> {
    const [data, total] = await this.galleryRepository.findAndCount({
      where: { isPrivate: false },
      relations: ['user', 'album', 'likes', 'comments'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async findUserGalleries(userId: number, targetUserId?: number): Promise<Gallery[]> {
    const whereConditions: any = {};
    
    if (targetUserId) {
      whereConditions.userId = targetUserId;
      // If viewing others' galleries, only show public ones unless it's the owner
      if (targetUserId !== userId) {
        whereConditions.isPrivate = false;
      }
    } else {
      whereConditions.userId = userId;
    }

    return await this.galleryRepository.find({
      where: whereConditions,
      relations: ['user', 'album', 'likes', 'comments'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Gallery> {
    const gallery = await this.galleryRepository.findOne({
      where: { id },
      relations: ['user', 'album', 'likes', 'comments'],
    });

    if (!gallery) {
      throw new NotFoundException('Gallery tidak ditemukan');
    }

    // Check privacy
    if (gallery.isPrivate && gallery.userId !== userId) {
      throw new ForbiddenException('Gallery ini private');
    }

    // Increment view count if not owner
    if (gallery.userId !== userId) {
      gallery.viewCount += 1;
      await this.galleryRepository.save(gallery);
    }

    return gallery;
  }

  async update(id: number, userId: number, updateGalleryDto: UpdateGalleryDto): Promise<Gallery> {
    const gallery = await this.galleryRepository.findOne({
      where: { id, userId },
    });

    if (!gallery) {
      throw new NotFoundException('Gallery tidak ditemukan atau tidak memiliki akses');
    }

    // Check if album exists and belongs to user (if updating album)
    if (updateGalleryDto.albumId) {
      const album = await this.albumRepository.findOne({
        where: { id: updateGalleryDto.albumId, userId },
      });

      if (!album) {
        throw new NotFoundException('Album tidak ditemukan atau tidak memiliki akses');
      }
    }

    Object.assign(gallery, updateGalleryDto);
    return await this.galleryRepository.save(gallery);
  }

  async remove(id: number, userId: number): Promise<void> {
    const gallery = await this.galleryRepository.findOne({
      where: { id, userId },
    });

    if (!gallery) {
      throw new NotFoundException('Gallery tidak ditemukan atau tidak memiliki akses');
    }

    await this.galleryRepository.remove(gallery);
  }

  async incrementDownloadCount(id: number): Promise<void> {
    await this.galleryRepository.increment({ id }, 'downloadCount', 1);
  }

  async getAlbumGalleries(albumId: number, userId: number): Promise<Gallery[]> {
    const album = await this.albumRepository.findOne({
      where: { id: albumId },
      relations: ['user'],
    });

    if (!album) {
      throw new NotFoundException('Album tidak ditemukan');
    }

    // Check privacy
    if (album.isPrivate && album.userId !== userId) {
      throw new ForbiddenException('Album ini private');
    }

    return await this.galleryRepository.find({
      where: { albumId },
      relations: ['user', 'likes', 'comments'],
      order: { createdAt: 'DESC' },
    });
  }
}